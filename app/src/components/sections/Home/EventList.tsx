import type { Component } from 'solid-js';
import { createMemo, createResource, For, Show } from 'solid-js';
import { isServer } from 'solid-js/web';

import { formatEventLocation, locationFor } from '../../../data/eventLocations';
import { eventsSnapshot } from '../../../data/eventsSnapshot.generated';
import { siteConfig } from '../../../data/site';
import { upcoming } from '../../../data/upcomingEvents';
import type { HumanistEvent } from '../../../lib/parseIcal';
import styles from './EventList.module.css';

// The page shows only the next two; this is where the rest of them live.
const ALL_EVENTS_URL = 'https://www.meetup.com/stanislaus-humanists/events/';

// Events are stored as 'YYYY-MM-DD' so they sort as plain strings, and shown as
// 'August 8, 2026'. Pinned to en-US rather than the visitor's locale to keep the
// format the one the site was written for.
const dateFormat = new Intl.DateTimeFormat('en-US', {
  month: 'long',
  day: 'numeric',
  year: 'numeric',
});

// Built from the separate fields instead of new Date(iso): that reads the string
// as UTC midnight, which formats back as the day before in every US timezone.
function formatEventDate(iso: string): string {
  const [year, month, day] = iso.split('-').map(Number);
  // A real date has no zero part, so this catches malformed feed data and shows
  // it as-is rather than rendering "Invalid Date" on the live site.
  if (!year || !month || !day) return iso;
  return dateFormat.format(new Date(year, month - 1, day));
}

async function fetchEvents(): Promise<HumanistEvent[]> {
  const response = await fetch('/api/events');
  if (!response.ok) throw new Error(`/api/events returned ${response.status}`);
  const data = (await response.json()) as { events: HumanistEvent[] };
  return data.events;
}

const EventList: Component = () => {
  // Source is false during prerender so the fetch never runs in Node; the
  // built HTML ships the snapshot, which is what crawlers read.
  const [live] = createResource(() => !isServer, fetchEvents);

  // Falls back to the snapshot whenever the live list is missing — still
  // loading, or the request failed. Either way the section keeps its content.
  const shown = createMemo(() => upcoming(live.latest ?? eventsSnapshot));

  return (
    <div id="events" class="container">
      <h2>Upcoming Events</h2>
      <Show
        when={shown().length > 0}
        fallback={
          <p>
            Game Night and Coffee Klatch meet monthly.{' '}
            <a href={siteConfig.social.meetup} target="_blank" rel="noopener noreferrer">
              See the group on Meetup
            </a>{' '}
            for the next dates.
          </p>
        }
      >
        <ul class={styles.grid}>
          <For each={shown()}>
            {(event) => {
              const location = locationFor(event.title);

              return (
                <li class={styles.card}>
                  <h3 class={styles.title}>{event.title}</h3>
                  <p class={styles.when}>
                    <time datetime={event.startsAt}>{formatEventDate(event.date)}</time>
                    {event.time ? `, ${event.time}` : ''}
                  </p>
                  <Show when={location}>
                    {(venue) => <p class={styles.where}>{formatEventLocation(venue())}</p>}
                  </Show>
                  <Show when={event.description}>
                    <p class={styles.description}>{event.description}</p>
                  </Show>
                  <Show when={event.url}>
                    <a
                      class={styles.link}
                      href={event.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      // Every card repeats the same "More info" text, which reads
                      // as a list of identical links when tabbing or using a
                      // screen reader's link list. The title disambiguates them.
                      aria-label={`${event.urlLabel ?? 'More info'}: ${event.title}`}
                    >
                      {event.urlLabel ?? 'More info'}
                    </a>
                  </Show>
                </li>
              );
            }}
          </For>
        </ul>
        <p class={styles.allEvents}>
          <a href={ALL_EVENTS_URL} target="_blank" rel="noopener noreferrer">
            See all our events
          </a>
        </p>
      </Show>
      {/* The snapshot is already on screen, so a spinner would replace real
          content with less. This announces the refresh instead. */}
      <Show when={live.loading}>
        <p class={styles.status} aria-live="polite">
          Checking Meetup for the latest…
        </p>
      </Show>
    </div>
  );
};

export default EventList;
