/**
 * Events that show regardless of how far off they are.
 *
 * The home page otherwise shows the next UPCOMING_LIMIT events by date, which
 * buries a once-a-year event behind the monthly ones. Pinning by Meetup event
 * id keeps a specific event on the page until it ends, then the list goes back
 * to the rolling two on its own — no dated edit to undo later.
 *
 * Pinned events still come from the feed. This file only names the ones to
 * keep; if an id here is cancelled on Meetup it drops out of the feed and the
 * page simply stops showing it.
 */

export interface PinnedEvent {
  /** Feed UID without the '@meetup.com' suffix, e.g. 'event_316444772'. */
  id: string;
  /** Why this one is pinned. For whoever reads this file next. */
  note: string;
  /**
   * Set when the group is not the organizer. Without it the JSON-LD would
   * credit Stanislaus Humanists as organizer of someone else's event.
   */
  organizer?: { name: string; url: string };
}

export const pinnedEvents: PinnedEvent[] = [
  {
    id: 'event_316444772',
    note: 'California Freethought Day 2026 — annual, Oct 11. Expires on its own.',
    organizer: {
      name: 'California Freethought Day',
      url: 'https://freethoughtday.org',
    },
  },
];

const byId = new Map(pinnedEvents.map((pin) => [pin.id, pin]));

export function pinFor(id: string): PinnedEvent | undefined {
  return byId.get(id);
}

export function isPinned(id: string): boolean {
  return byId.has(id);
}
