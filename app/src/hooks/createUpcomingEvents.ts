import type { Accessor, ParentComponent } from 'solid-js';
import { createComponent, createContext, createMemo, createResource, useContext } from 'solid-js';
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

export interface UpcomingEvents {
  events: Accessor<HumanistEvent[]>;
  loading: Accessor<boolean>;
}

/**
 * The events the page shows, live from /api/events with the build-time
 * snapshot as fallback.
 */
export function createUpcomingEvents(): UpcomingEvents {
  // Source is false during prerender so the fetch never runs in Node; the
  // built HTML ships the snapshot, which is what crawlers read.
  const [live] = createResource(() => !isServer, fetchEvents);

  // Falls back to the snapshot whenever the live list is missing — still
  // loading, or the request failed. Either way the page keeps its content.
  const events = createMemo(() => upcoming(live.latest ?? eventsSnapshot));

  return { events, loading: () => live.loading };
}

const UpcomingEventsContext = createContext<UpcomingEvents>();

/**
 * Created once in RootLayout and read by both the hero (above the nav) and the
 * event list (in the Home section), so the page makes one request and the two
 * can't disagree about which event is next.
 */
export const UpcomingEventsProvider: ParentComponent = (props) =>
  createComponent(UpcomingEventsContext.Provider, {
    value: createUpcomingEvents(),
    get children() {
      return props.children;
    },
  });

export function useUpcomingEvents(): UpcomingEvents {
  const upcomingEvents = useContext(UpcomingEventsContext);
  if (!upcomingEvents) throw new Error('useUpcomingEvents needs an UpcomingEventsProvider');
  return upcomingEvents;
}
