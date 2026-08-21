/**
 * The sh-brief Worker.
 *
 * Cloudflare serves anything in ./dist before this runs, so the only requests
 * that arrive here are ones no built file matched — /api/* and genuine 404s.
 * Everything the site publishes is served without the Worker being invoked.
 */

import { createCheckoutSession, createCustomer } from './stripe';

export interface Env {
  /** Hands a request back to Cloudflare's static asset server. */
  ASSETS: { fetch(request: Request): Promise<Response> };
  /** Stripe secret key. Test key in the sandbox, live key at launch. */
  STRIPE_SECRET_KEY: string;
}

/**
 * Prices live here rather than in the Dashboard for now, built inline on each
 * Checkout Session. That trades tidiness for having no setup step at all: no
 * Products to create, no price IDs to copy into a config.
 *
 * SKELETON SHORTCUT. Inline price_data creates a throwaway Product per checkout,
 * which makes Stripe's own reporting useless for separating dues from donations
 * (criterion 31). Before this goes live, create the two Products in the
 * Dashboard and swap these for their price_ IDs.
 */
const LEVELS = {
  household: { name: 'Household Membership', annualAmountCents: 3600 },
  individual: { name: 'Individual Membership', annualAmountCents: 2400 },
} as const;

type Level = keyof typeof LEVELS;

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

/**
 * Everything here is validated again on the server even though the form checks
 * it too. The route is publicly reachable and a browser is not the only thing
 * that can call it.
 *
 * Note what is *not* accepted: an amount. The price is chosen server-side from
 * the level, because a client-supplied amount is the one input that turns a
 * validation gap into money.
 */
async function handleJoin(request: Request, env: Env): Promise<Response> {
  if (request.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405);
  }
  if (!env.STRIPE_SECRET_KEY) {
    return json({ error: 'Stripe key not configured' }, 500);
  }

  let payload: any;
  try {
    payload = await request.json();
  } catch {
    return json({ error: 'Expected JSON' }, 400);
  }

  const level = payload?.level as Level;
  if (!Object.prototype.hasOwnProperty.call(LEVELS, level)) {
    return json({ error: 'Unknown membership level' }, 400);
  }

  // SH does not have a membership for someone who has not agreed to the
  // principles, so this is a rejection rather than a stored 'false'.
  if (payload?.agreesToPrinciples !== true) {
    return json({ error: 'Agreement to the principles is required' }, 400);
  }

  const fields = {
    agreesToPrinciples: true,
    autoRenew: payload?.autoRenew === true,
    secondMemberName: String(payload?.secondMemberName ?? '').slice(0, 500),
    secondMemberAddress: String(payload?.secondMemberAddress ?? '').slice(0, 500),
    secondMemberEmail: String(payload?.secondMemberEmail ?? '').slice(0, 500),
  };

  const origin = new URL(request.url).origin;

  try {
    const customer = await createCustomer(fields, env.STRIPE_SECRET_KEY);
    const session = await createCheckoutSession(
      {
        customerId: customer.id,
        levelName: LEVELS[level].name,
        annualAmountCents: LEVELS[level].annualAmountCents,
        autoRenew: fields.autoRenew,
        joinMonth: new Date().getUTCMonth() + 1,
        // Placeholders. The real confirmation route is deferred — criteria
        // 22-23 need a page that says "you are now a member", not merely that a
        // payment succeeded, plus a different message for January joiners.
        successUrl: `${origin}/?joined=1`,
        cancelUrl: `${origin}/?canceled=1`,
      },
      env.STRIPE_SECRET_KEY,
    );

    return json({ url: session.url });
  } catch (error) {
    console.error('join failed:', error);
    return json({ error: (error as Error).message }, 502);
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const { pathname } = new URL(request.url);

    if (pathname === '/api/join') {
      return handleJoin(request, env);
    }

    return env.ASSETS.fetch(request);
  },
};
