/**
 * /api/donation-progress: the campaign's amount raised toward its goal, and
 * its latest gifts, for the progress bar in the Donate section.
 *
 * Server-side because it needs the Zeffy API key, which must never reach the
 * browser. It returns only amounts and dates: no donor names, emails or ids,
 * since this is a public page.
 *
 * Field names come from Zeffy's API reference
 * (https://www.zeffy.com/api/docs/openapi.json): a campaign has target and
 * volume, a payment has amount, created (Unix seconds) and refund_status, all
 * amounts in cents. toDonationProgress() is the one place they're mapped.
 */
import { zeffyCampaign } from '../data/zeffyCampaign';

const ZEFFY_API_BASE = 'https://api.zeffy.com/api/v1';
const TIMEOUT_MS = 10_000;
// Zeffy answers HTTP 429 over its rate limit, so every visitor shares one
// answer for this long.
const CACHE_SECONDS = 300;
const RECENT_GIFT_COUNT = 5;

export interface DonationProgress {
  raisedCents: number;
  goalCents: number | null;
  currency: string;
  recentGifts: { amountCents: number; createdAt: string }[];
}

interface ZeffyCampaign {
  target: number | null;
  volume: number;
  currency: string;
}

interface ZeffyPayment {
  amount: number;
  created: number;
  refund_status: 'none' | 'partial' | 'full';
}

export function toDonationProgress(
  campaign: ZeffyCampaign,
  payments: ZeffyPayment[],
): DonationProgress {
  return {
    raisedCents: campaign.volume,
    goalCents: campaign.target,
    currency: campaign.currency,
    recentGifts: payments
      // A fully refunded gift isn't a gift any more.
      .filter((payment) => payment.refund_status !== 'full')
      .slice(0, RECENT_GIFT_COUNT)
      .map((payment) => ({
        amountCents: payment.amount,
        createdAt: new Date(payment.created * 1000).toISOString(),
      })),
  };
}

async function zeffyGet<T>(apiPath: string, apiKey: string): Promise<T> {
  const response = await fetch(`${ZEFFY_API_BASE}${apiPath}`, {
    signal: AbortSignal.timeout(TIMEOUT_MS),
    headers: { authorization: `Bearer ${apiKey}`, accept: 'application/json' },
  });
  if (!response.ok) throw new Error(`Zeffy ${apiPath} returned HTTP ${response.status}`);
  return (await response.json()) as T;
}

async function fetchDonationProgress(apiKey: string): Promise<DonationProgress> {
  const campaignId = zeffyCampaign.campaignId;
  const [campaign, paymentList] = await Promise.all([
    zeffyGet<ZeffyCampaign>(`/campaigns/${campaignId}`, apiKey),
    // A few more than we show, so refunded ones can be dropped and still
    // leave RECENT_GIFT_COUNT.
    zeffyGet<{ data: ZeffyPayment[] }>(
      `/payments?campaign=${campaignId}&status=succeeded&limit=${RECENT_GIFT_COUNT * 2}`,
      apiKey,
    ),
  ]);
  return toDonationProgress(campaign, paymentList.data);
}

// Structural types, for the same reason as Env in index.ts: the Workers types
// clash with the DOM types this tsconfig also compiles against.
interface WorkerCache {
  match(request: Request): Promise<Response | undefined>;
  put(request: Request, response: Response): Promise<void>;
}
interface ExecutionContextLike {
  waitUntil(promise: Promise<unknown>): void;
}

export async function handleDonationProgress(
  request: Request,
  apiKey: string | undefined,
  ctx: ExecutionContextLike,
): Promise<Response> {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return new Response('Method not allowed', {
      status: 405,
      headers: { allow: 'GET, HEAD' },
    });
  }

  if (!apiKey) {
    return Response.json(
      { error: 'zeffy_not_configured' },
      { status: 503, headers: { 'cache-control': 'no-store' } },
    );
  }

  // One cache entry for everyone, whatever query string the request had.
  const cacheKey = new Request(new URL('/api/donation-progress', request.url).toString());
  const cache = (globalThis.caches as unknown as { default: WorkerCache }).default;

  const cached = await cache.match(cacheKey);
  if (cached) return cached;

  try {
    const progress = await fetchDonationProgress(apiKey);
    const response = Response.json(progress, {
      headers: { 'cache-control': `public, max-age=${CACHE_SECONDS}` },
    });
    ctx.waitUntil(cache.put(cacheKey, response.clone()));
    return response;
  } catch (error) {
    // The page says "Live totals are unavailable right now" on a non-200,
    // rather than showing $0, which would read as nobody having given.
    console.error('donation progress failed', error);
    return Response.json(
      { error: 'donation_progress_unavailable' },
      { status: 503, headers: { 'cache-control': 'no-store' } },
    );
  }
}
