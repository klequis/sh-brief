import type { Accessor } from 'solid-js';
import { createMemo, createResource } from 'solid-js';
import { isServer } from 'solid-js/web';

import { eventsSnapshot } from '../data/eventsSnapshot.generated';
import { upcoming } from '../data/upcomingEvents';
import type { HumanistEvent } from '../lib/parseIcal';

async function fetchEvents(): Promise<HumanistEvent[]> {
  const response = await fetch('/api/events');
  if (!response.ok) throw new Error(`/api/events returned ${response.status}`);
  const data = (await response.json()) as { events: HumanistEvent[] };
  return data.events;
}

/**
 * The events the home page shows, live from /api/events with the build-time
 * snapshot as fallback. Created once in Home and handed to both the hero and
 * the event list, so the page makes one request and the two can't disagree
 * about which event is next.
 */
export function createUpcomingEvents(): {
  events: Accessor<HumanistEvent[]>;
  loading: Accessor<boolean>;
} {
  // Source is false during prerender so the fetch never runs in Node; the
  // built HTML ships the snapshot, which is what crawlers read.
  const [live] = createResource(() => !isServer, fetchEvents);

  // Falls back to the snapshot whenever the live list is missing — still
  // loading, or the request failed. Either way the page keeps its content.
  const events = createMemo(() => upcoming(live.latest ?? eventsSnapshot));

  return { events, loading: () => live.loading };
}
