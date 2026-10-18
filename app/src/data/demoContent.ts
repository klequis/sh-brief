/**
 * Placeholder content for the redesign demo (branch redesign-01).
 *
 * Everything here is made up or mocked so the design can be judged before the
 * real systems exist: ActionNetwork isn't set up yet, the Meetup feed carries
 * no past events or attendance, and we have no consented photos of our own.
 * Each entry says what will replace it.
 */

/** Mock ActionNetwork links. The real ones come once the board approves
 *  ActionNetwork and the event and form pages are created. */
export const demoActionNetwork = {
  /** Every RSVP button points here until each event has its own page. */
  rsvpUrl: 'https://actionnetwork.org/events/stanislaus-humanists-demo-rsvp',
  /** The monthly-email signup form. */
  monthlyEmailSignupUrl:
    'https://actionnetwork.org/forms/stanislaus-humanists-demo-monthly-email',
};

/**
 * The "Last gathering" freshness line. Will come from past events (with real
 * attendance) once events run through ActionNetwork. The date and event are
 * real; the head count is invented.
 */
export const demoLastGathering = {
  date: '2026-10-11',
  eventTitle: 'California Freethought Day',
  attendeeCount: 14,
};

/** Stock photo standing in until the group has consented photos of its own.
 *  Free under the Unsplash License: https://unsplash.com/photos/rioA77g2-XU */
export const demoHeroPhoto = {
  /** Relative to public/; the component prefixes BASE_URL. */
  src: 'demo/hero-friends-cafe.jpg',
  alt: 'Four friends talking and laughing over coffee and pizza at a café table',
  credit: 'Demo photo: Vitaly Gariev / Unsplash',
};
