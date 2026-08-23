/**
 * Builds the JSON-LD injected into <head> at build time by
 * scripts/prerender.mjs. Imported only by src/entry-prerender.tsx, so none of
 * this reaches the browser bundle.
 *
 * Three nodes, all generated from the same typed data the page renders from:
 *   NGO      — the organization itself
 *   Event    — one per entry in the generated snapshot, the highest-value
 *              piece here, since it makes the group eligible for event rich
 *              results. The snapshot is only as fresh as the last build; the
 *              live list visitors see comes from /api/events.
 *   FAQPage  — from data/faqs.ts
 */
import type { EventLocation } from '../data/eventLocations';
import { locationFor } from '../data/eventLocations';
import { eventsSnapshot } from '../data/eventsSnapshot.generated';
import type { HumanistEvent } from '../lib/parseIcal';
import { faqs } from '../data/faqs';
import { siteConfig } from '../data/site';

const ORG_ID = `${siteConfig.url}/#organization`;
const LOGO_URL = `${siteConfig.url}/logo.png`;

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
      'based in Modesto, California and serving the northern San Joaquin ' +
      'Valley. We advance Humanism — an ethical, life-affirming philosophy ' +
      'without supernatural beliefs — and promote a secular society where no ' +
      'one imposes their beliefs on others.',
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
    areaServed: siteConfig.areaServed.map((name) => ({
      '@type': 'AdministrativeArea',
      name,
    })),
    memberOf: {
      '@type': 'Organization',
      name: parentOrg.name,
      url: parentOrg.url,
    },
    sameAs: Object.values(siteConfig.social),
  };
}

function event(item: HumanistEvent) {
  const location = locationFor(item.title);

  return {
    '@type': 'Event',
    '@id': `${siteConfig.url}/#event-${item.id}`,
    name: item.title,
    startDate: item.startsAt,
    endDate: item.endsAt,
    ...(item.description ? { description: item.description } : {}),
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    ...(location ? { location: place(location) } : {}),
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
    '@graph': [organization(), ...eventsSnapshot.map(event), faqPage()],
  };
}

export function structuredDataScript(): string {
  const json = JSON.stringify(buildStructuredData());
  // Escaping "<" stops a "</script>" inside any description from closing the
  // tag early. < is still valid JSON and parses back to the same string.
  const safe = json.replace(/</g, '\\u003c');
  return `<script type="application/ld+json">${safe}</script>`;
}
