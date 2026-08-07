export interface HumanistEvent {
  id: string;
  title: string;
  date: string; // ISO 'YYYY-MM-DD'
  time?: string;
  location?: string;
  description?: string;
  url?: string;
  urlLabel?: string;
}

// Add new events here — EventList sorts by date ascending and shows
// "No upcoming events" automatically when this array is empty.
export const events: HumanistEvent[] = [
  {
    id: "1",
    title: "Coffee Klatch",
    date: "2026-08-08",
    time: "9:00 AM",
    location: "Queen Bean Coffee House, 1126 14th St, Modesto, CA 95354",
    description: "Social event",
    url: "https://meetup.com",
  }
];
