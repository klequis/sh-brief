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
    title: "Game Night",
    date: "2026-08-22",
    time: "5:00 PM",
    location: "Round Table Pizza, 2441 Claribel Rd Ste J · Riverbank, CA",
    description: "Come and play some games with us! We will have a variety of games to choose from.",
    url: "https://www.meetup.com/stanislaus-humanists/events/315953894",
  },
  {
    id: "2",
    title: "Coffee Klatch",
    date: "2026-09-13",
    time: "10:00 AM",
    location: "Queen Bean Coffee House, 1126 14th St, Modesto, CA 95354",
    description: "Social event: Bring books, devices, or notepads while we solve the world's problems, exchange witty repartee, and drink delicious coffee.",
    url: "https://www.meetup.com/stanislaus-humanists/events/315836966/",
  }
];