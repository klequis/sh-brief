/**
 * The one place that decides which events the site shows.
 *
 * Shared by the cards and the JSON-LD so the two cannot disagree: markup that
 * advertises events the page does not display contradicts the visible content,
 * which is the thing Google's structured data guidelines actually penalize.
 */
import type { HumanistEvent } from '../lib/parseIcal';
import { isPinned } from './pinnedEvents';

/** How many events the home page shows by date. Pinned events are extra. */
export const UPCOMING_LIMIT = 2;

function byStart(a: HumanistEvent, b: HumanistEvent): number {
  return a.startsAt.localeCompare(b.startsAt);
}

/**
 * The next UPCOMING_LIMIT events by date, plus every pinned event still to
 * come, merged into date order. Past events dropped.
 *
 * Pinned events do not use up one of the UPCOMING_LIMIT slots — the point of a
 * pin is to add a distant event without hiding the next monthly one. So the
 * page shows two events normally and three while a pin is live.
 *
 * The Worker already drops past events and the snapshot has none at build time,
 * but the snapshot goes stale between deploys. Filtering here is what keeps a
 * past event off the page when the fallback is showing.
 */
export function upcoming(
  list: HumanistEvent[],
  now: number = Date.now(),
): HumanistEvent[] {
  const future = list.filter((item) => Date.parse(item.endsAt) > now).sort(byStart);

  return [
    ...future.filter((item) => isPinned(item.id)),
    ...future.filter((item) => !isPinned(item.id)).slice(0, UPCOMING_LIMIT),
  ].sort(byStart);
}
