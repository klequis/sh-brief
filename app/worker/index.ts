/**
 * The sh-brief Worker.
 *
 * Cloudflare serves anything in ./dist before this runs, so the only requests
 * that arrive here are ones no built file matched. Today that means /api/* and
 * genuine 404s; everything the site actually publishes is served without the
 * Worker being invoked at all.
 */

export interface Env {
  /** Hands a request back to Cloudflare's static asset server. */
  ASSETS: { fetch(request: Request): Promise<Response> };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    return env.ASSETS.fetch(request);
  },
};
