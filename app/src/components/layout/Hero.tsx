import type { Component } from 'solid-js';
import { Show } from 'solid-js';

import { demoActionNetwork, demoHeroPhoto, demoLastGathering } from '../../data/demoContent';
import { locationFor } from '../../data/eventLocations';
import { useUpcomingEvents } from '../../hooks/createUpcomingEvents';
import { HERO_ID } from './Header';
import styles from './Hero.module.css';

// 'Sat, Oct 24' — short enough to sit on one line next to the time on a phone.
// Pinned to en-US for the same reason as the event cards.
const shortDateFormat = new Intl.DateTimeFormat('en-US', {
  weekday: 'short',
  month: 'short',
  day: 'numeric',
});

// Built from the 'YYYY-MM-DD' parts rather than new Date(iso), which reads the
// string as UTC midnight and formats back as the day before in US timezones.
function formatShortDate(iso: string): string {
  const [year, month, day] = iso.split('-').map(Number);
  if (!year || !month || !day) return iso;
  return shortDateFormat.format(new Date(year, month - 1, day));
}

/**
 * The top of the page, under the see-through header: the town, the next event
 * and the one button, over the photo. Built to pass the playbook's Stranger
 * Test — a newcomer on a phone should know when and where the next event is
 * without scrolling.
 */
const Hero: Component = () => {
  const upcomingEvents = useUpcomingEvents();
  const nextEvent = () => upcomingEvents.events()[0];
  const lastGatheringDate = formatShortDate(demoLastGathering.date).replace(/^\w+, /, '');

  return (
    <div id={HERO_ID} class={styles.hero}>
      <img
        class={styles.photo}
        src={`${import.meta.env.BASE_URL}${demoHeroPhoto.src}`}
        alt={demoHeroPhoto.alt}
        // Above the fold, so it should start loading right away.
        fetchpriority="high"
      />
      <div class={`container ${styles.inner}`}>
        <div class={styles.intro}>
          <h1 class={styles.headline}>
            Modesto's community for humanists, atheists, agnostics, and the
            friendly-curious.
          </h1>
          <p class={styles.lastGathering}>
            Last get-together: {lastGatheringDate}, {demoLastGathering.eventTitle}.{' '}
            {demoLastGathering.attendeeCount} of us were there.
          </p>
        </div>

        <div class={styles.nextEventCard}>
          <Show
            when={nextEvent()}
            // No future event in the feed: say so warmly and make the email
            // signup the one button, rather than showing an empty card.
            fallback={
              <>
                <p class={styles.nextEventLabel}>Next get-together</p>
                <p class={styles.nextEventTitle}>We meet most months.</p>
                <p class={styles.nextEventDetail}>
                  Get the monthly email and we'll tell you the next date.
                </p>
                <a
                  class={styles.primaryButton}
                  href={demoActionNetwork.monthlyEmailSignupUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Get the monthly email
                </a>
              </>
            }
          >
            {(shownEvent) => {
              const venue = locationFor(shownEvent().title);
              return (
                <>
                  <p class={styles.nextEventLabel}>Next get-together</p>
                  <h2 class={styles.nextEventTitle}>{shownEvent().title}</h2>
                  {/* When and where on one line: two lines of detail was most
                      of what made the old white card tall. */}
                  <p class={styles.nextEventWhenWhere}>
                    <time class={styles.nextEventWhen} datetime={shownEvent().startsAt}>
                      {formatShortDate(shownEvent().date)}
                      {shownEvent().time ? ` · ${shownEvent().time}` : ''}
                    </time>
                    <Show when={venue}>
                      {(v) => ` · ${v().name}, ${v().city}`}
                    </Show>
                  </p>
                  <a
                    class={styles.primaryButton}
                    href={demoActionNetwork.rsvpUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    RSVP — save me a seat
                  </a>
                  <a
                    class={styles.quietLink}
                    href={demoActionNetwork.monthlyEmailSignupUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Not ready? Get the monthly email
                  </a>
                </>
              );
            }}
          </Show>
        </div>
      </div>
      <p class={styles.photoCredit}>{demoHeroPhoto.credit}</p>
    </div>
  );
};

export default Hero;
