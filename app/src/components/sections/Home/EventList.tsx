import type { Component } from 'solid-js';
import { For, Show } from 'solid-js';

import { events, formatEventLocation } from '../../../data/events';
import styles from './EventList.module.css';

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
  // A real date has no zero part, so this catches typos in the data file and
  // shows them as-is rather than rendering "Invalid Date" on the live site.
  if (!year || !month || !day) return iso;
  return dateFormat.format(new Date(year, month - 1, day));
}

const EventList: Component = () => {
  const sorted = [...events].sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div id="events" class="container">
      <h2>Upcoming Events</h2>
      <Show when={sorted.length > 0} fallback={<p>No upcoming events</p>}>
        <ul class={styles.grid}>
          <For each={sorted}>
            {(event) => (
              <li class={styles.card}>
                <h3 class={styles.title}>{event.title}</h3>
                <p class={styles.when}>
                  <time datetime={event.date}>{formatEventDate(event.date)}</time>
                  {event.time ? `, ${event.time}` : ''}
                </p>
                <Show when={event.location}>
                  {(location) => (
                    <p class={styles.where}>{formatEventLocation(location())}</p>
                  )}
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
            )}
          </For>
        </ul>
      </Show>
    </div>
  );
};

export default EventList;
