/**
 * The site's only server code.
 *
 * Exists because Meetup serves the iCal feed with no Access-Control-Allow-Origin
 * header, so the browser cannot fetch it directly. This route fetches it
 * server-side and hands back JSON.
 *
 * Everything else is static. assets.run_worker_first is deliberately unset in
 * wrangler.jsonc, so Cloudflare serves any request matching a built file
 * without invoking this script at all — a bug in here cannot take down the home
 * page. Only paths matching no asset arrive, and anything but /api/events gets
 * the 404 the asset server would have returned.
 */
import { parseIcal } from '../lib/parseIcal';

const FEED_URL = 'https://www.meetup.com/stanislaus-humanists/events/ical/';
const TIMEOUT_MS = 10_000;

interface Env {
  // Structural rather than Cloudflare's Fetcher: @cloudflare/workers-types
  // declares globals that clash with the DOM types the Solid app compiles
  // against, and this tsconfig is shared by both.
  ASSETS: { fetch(request: Request): Promise<Response> };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname !== '/api/events') {
      return env.ASSETS.fetch(request);
    }

    if (request.method !== 'GET' && request.method !== 'HEAD') {
      return new Response('Method not allowed', {
        status: 405,
        headers: { allow: 'GET, HEAD' },
      });
    }

    try {
      const response = await fetch(FEED_URL, {
        signal: AbortSignal.timeout(TIMEOUT_MS),
        headers: { accept: 'text/calendar' },
      });

      if (!response.ok) {
        throw new Error(`Feed returned HTTP ${response.status}`);
      }

      const events = parseIcal(await response.text());

      return Response.json(
        { events },
        {
          headers: {
            // No caching yet: measure the real load time before adding it.
            'cache-control': 'no-store',
          },
        },
      );
    } catch (error) {
      // The page falls back to its build-time snapshot on a non-200, so say so
      // plainly rather than returning an empty list that reads as "no events".
      console.error('events feed failed', error);
      return Response.json(
        { error: 'events_unavailable' },
        { status: 503, headers: { 'cache-control': 'no-store' } },
      );
    }
  },
};
