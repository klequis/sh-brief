import type { Component } from 'solid-js';
import { For, Show } from 'solid-js';

import { events } from '../../../data/events';

const EventList: Component = () => {
  const sorted = [...events].sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div id="events" class="container">
      <h2>Upcoming Events</h2>
      <Show when={sorted.length > 0} fallback={<p>No upcoming events</p>}>
        <ul>
          <For each={sorted}>
            {(event) => (
              <li>
                <strong>{event.title}</strong> — {event.date}
                {event.time ? `, ${event.time}` : ''}
                {event.location ? ` — ${event.location}` : ''}
                <Show when={event.description}>
                  <p>{event.description}</p>
                </Show>
                <Show when={event.url}>
                  <a href={event.url} target="_blank" rel="noopener noreferrer">
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
