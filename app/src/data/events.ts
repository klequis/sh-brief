export interface EventLocation {
  /** Venue name, e.g. 'Queen Bean Coffee House'. */
  name: string;
  street: string;
  city: string;
  /** Two-letter state code, e.g. 'CA'. */
  region: string;
  postalCode?: string;
}

export interface HumanistEvent {
  id: string;
  title: string;
  date: string; // ISO 'YYYY-MM-DD'
  time?: string;
  location?: EventLocation;
  description?: string;
  url?: string;
  urlLabel?: string;
}

// Add new events here — EventList sorts by date ascending and shows
// "No upcoming events" automatically when this array is empty.
export const events: HumanistEvent[] = [
    {
    id: '1',
    title: 'Coffee Klatch',
    date: '2026-09-13',
    time: '10:00 AM',
    location: {
      name: 'Queen Bean Coffee House',
      street: '1126 14th St',
      city: 'Modesto',
      region: 'CA',
      postalCode: '95354',
    },
    description:
      "Social event: Bring books, devices, or notepads while we solve the world's problems, exchange witty repartee, and drink delicious coffee.",
    url: 'https://www.meetup.com/stanislaus-humanists/events/315836966/',
  },
  {
    id: '2',
    title: 'Game Night',
    date: '2026-09-26',
    time: '5:00 PM',
    location: {
      name: 'Round Table Pizza',
      street: '2441 Claribel Rd Ste J',
      city: 'Riverbank',
      region: 'CA',
    },
    description:
      'Come and play some games with us! We will have a variety of games to choose from.',
    url: 'https://www.meetup.com/stanislaus-humanists/events/315953894',
  },
];

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
