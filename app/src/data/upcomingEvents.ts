/**
 * The one place that decides which events the site shows.
 *
 * Shared by the cards and the JSON-LD so the two cannot disagree: markup that
 * advertises events the page does not display contradicts the visible content,
 * which is the thing Google's structured data guidelines actually penalize.
 */
import type { HumanistEvent } from '../lib/parseIcal';

/** How many upcoming events the home page shows. */
export const UPCOMING_LIMIT = 2;

/**
 * Soonest first, past events dropped, capped at UPCOMING_LIMIT.
 *
 * The Worker already drops past events and the snapshot has none at build time,
 * but the snapshot goes stale between deploys. Filtering here is what keeps a
 * past event off the page when the fallback is showing.
 */
export function upcoming(
  list: HumanistEvent[],
  now: number = Date.now(),
): HumanistEvent[] {
  return list
    .filter((item) => Date.parse(item.endsAt) > now)
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt))
    .slice(0, UPCOMING_LIMIT);
}
