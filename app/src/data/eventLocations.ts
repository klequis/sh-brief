/**
 * Hand-maintained venue data.
 *
 * The Meetup iCal feed carries no LOCATION field, so addresses live here and
 * are matched to feed events by substring. Kept apart from
 * eventsSnapshot.generated.ts, which a script rewrites — an address edited into
 * a generated file would be overwritten on the next build.
 */

export interface EventLocation {
  /** Venue name, e.g. 'Queen Bean Coffee House'. */
  name: string;
  street: string;
  city: string;
  /** Two-letter state code, e.g. 'CA'. */
  region: string;
  postalCode?: string;
}

interface LocationRule {
  /**
   * Matched case-insensitively against the feed's SUMMARY. A substring rather
   * than the whole title: Meetup calls the coffee event
   * 'Queen Bean Coffee Klatch (2nd Sunday)', not 'Coffee Klatch'.
   */
  match: string;
  location: EventLocation;
}

// First match wins, so order matters if a title ever matches two rules.
const rules: LocationRule[] = [
  {
    match: 'Coffee Klatch',
    location: {
      name: 'Queen Bean Coffee House',
      street: '1126 14th St',
      city: 'Modesto',
      region: 'CA',
      postalCode: '95354',
    },
  },
  {
    match: 'Game Night',
    location: {
      name: 'Round Table Pizza',
      street: '2441 Claribel Rd Ste J',
      city: 'Riverbank',
      region: 'CA',
    },
  },
];

/**
 * The venue for an event title, or undefined when no rule matches. Never guess
 * an address: an unmatched event renders without one.
 */
export function locationFor(title: string): EventLocation | undefined {
  const haystack = title.toLowerCase();
  return rules.find((rule) => haystack.includes(rule.match.toLowerCase()))?.location;
}

// Locations are stored as parts so the JSON-LD Place/PostalAddress and the text
// on the event card come from one source. This is the display form.
export function formatEventLocation(location: EventLocation): string {
  const city = [location.city, location.region].filter(Boolean).join(', ');
  return [
    location.name,
    location.street,
    location.postalCode ? `${city} ${location.postalCode}` : city,
  ]
    .filter(Boolean)
    .join(', ');
}
