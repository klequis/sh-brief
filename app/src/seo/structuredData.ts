/**
 * Builds the JSON-LD injected into <head> at build time by
 * scripts/prerender.mjs. Imported only by src/entry-prerender.tsx, so none of
 * this reaches the browser bundle.
 *
 * Three nodes, all generated from the same typed data the page renders from:
 *   NGO      — the organization itself
 *   Event    — one per entry in data/events.ts, the highest-value piece here,
 *              since it makes the group eligible for event rich results
 *   FAQPage  — from data/faqs.ts
 */
import type { EventLocation, HumanistEvent } from '../data/events';
import { events } from '../data/events';
import { faqs } from '../data/faqs';
import { siteConfig } from '../data/site';

// Every venue so far is in the Modesto area, and the times in data/events.ts
// are written as local wall-clock times for readers here.
const TIME_ZONE = 'America/Los_Angeles';

const ORG_ID = `${siteConfig.url}/#organization`;
const LOGO_URL = `${siteConfig.url}/logo.png`;

/** Offset for an instant in TIME_ZONE, as "+HH:MM" / "-HH:MM". */
function zoneOffset(instant: Date): string {
  const name = new Intl.DateTimeFormat('en-US', {
    timeZone: TIME_ZONE,
    timeZoneName: 'longOffset',
  })
    .formatToParts(instant)
    .find((part) => part.type === 'timeZoneName')?.value;

  // "GMT-07:00" -> "-07:00". Bare "GMT" means UTC.
  const offset = name?.replace('GMT', '').trim() ?? '';
  return offset === '' ? '+00:00' : offset;
}

function offsetMinutes(instant: Date): number {
  const match = /^([+-])(\d{2}):(\d{2})$/.exec(zoneOffset(instant));
  if (!match) return 0;
  const sign = match[1] === '-' ? -1 : 1;
  return sign * (Number(match[2]) * 60 + Number(match[3]));
}

function parseTime(time: string | undefined) {
  if (!time) return undefined;
  const match = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i.exec(time.trim());
  if (!match) return undefined;

  const hours = Number(match[1]) % 12;
  return {
    hours: match[3].toUpperCase() === 'PM' ? hours + 12 : hours,
    minutes: Number(match[2]),
  };
}

/**
 * 'YYYY-MM-DD' + '5:00 PM' -> '2026-08-22T17:00:00-07:00'.
 *
 * Emitting the offset rather than a bare local time keeps the event from
 * shifting by a few hours for anyone reading in another timezone. Falls back to
 * the date alone when there's no parseable time, which schema.org allows.
 */
function startDateTime(event: HumanistEvent): string | undefined {
  const [year, month, day] = event.date.split('-').map(Number);
  if (!year || !month || !day) return undefined;

  const time = parseTime(event.time);
  if (!time) return event.date;

  // The offset depends on the instant, which depends on the offset. Starting
  // from the wall-clock time read as UTC and correcting twice converges
  // everywhere except inside a DST transition hour.
  const naive = Date.UTC(year, month - 1, day, time.hours, time.minutes);
  let instant = naive;
  for (let pass = 0; pass < 2; pass += 1) {
    instant = naive - offsetMinutes(new Date(instant)) * 60_000;
  }

  const pad = (value: number) => String(value).padStart(2, '0');
  const clock = `${pad(time.hours)}:${pad(time.minutes)}:00`;
  return `${event.date}T${clock}${zoneOffset(new Date(instant))}`;
}

function place(location: EventLocation) {
  return {
    '@type': 'Place',
    name: location.name,
    address: {
      '@type': 'PostalAddress',
      streetAddress: location.street,
      addressLocality: location.city,
      addressRegion: location.region,
      ...(location.postalCode ? { postalCode: location.postalCode } : {}),
      addressCountry: 'US',
    },
  };
}

function organization() {
  const { mailingAddress, parentOrg } = siteConfig;

  return {
    '@type': 'NGO',
    '@id': ORG_ID,
    name: siteConfig.orgName,
    url: siteConfig.url,
    logo: LOGO_URL,
    image: LOGO_URL,
    email: siteConfig.email,
    slogan: siteConfig.tagline,
    description:
      'Stanislaus Humanists is a chapter of the American Humanist Association ' +
      'serving Modesto and Stanislaus County, California. We advance Humanism — ' +
      'an ethical, life-affirming philosophy without supernatural beliefs — and ' +
      'promote a secular society where no one imposes their beliefs on others.',
    foundingDate: siteConfig.founded,
    nonprofitStatus: 'Nonprofit501c3',
    address: {
      '@type': 'PostalAddress',
      postOfficeBoxNumber: mailingAddress.poBox,
      addressLocality: mailingAddress.city,
      addressRegion: mailingAddress.region,
      postalCode: mailingAddress.postalCode,
      addressCountry: 'US',
    },
    areaServed: {
      '@type': 'AdministrativeArea',
      name: 'Stanislaus County, California',
    },
    memberOf: {
      '@type': 'Organization',
      name: parentOrg.name,
      url: parentOrg.url,
    },
    sameAs: Object.values(siteConfig.social),
  };
}

function event(item: HumanistEvent) {
  const startDate = startDateTime(item);

  return {
    '@type': 'Event',
    '@id': `${siteConfig.url}/#event-${item.id}`,
    name: item.title,
    ...(startDate ? { startDate } : {}),
    ...(item.description ? { description: item.description } : {}),
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    ...(item.location ? { location: place(item.location) } : {}),
    // The Meetup listing is where the details and RSVP live. This becomes an
    // on-site event page once #14 lands.
    ...(item.url ? { url: item.url } : {}),
    // Google treats an event image as recommended. There are no per-event
    // photos yet, so the org logo stands in rather than omitting the field.
    image: LOGO_URL,
    organizer: { '@id': ORG_ID },
  };
}

function faqPage() {
  return {
    '@type': 'FAQPage',
    '@id': `${siteConfig.url}/#faq`,
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export function buildStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@graph': [organization(), ...events.map(event), faqPage()],
  };
}

export function structuredDataScript(): string {
  const json = JSON.stringify(buildStructuredData());
  // Escaping "<" stops a "</script>" inside any description from closing the
  // tag early. < is still valid JSON and parses back to the same string.
  const safe = json.replace(/</g, '\\u003c');
  return `<script type="application/ld+json">${safe}</script>`;
}
