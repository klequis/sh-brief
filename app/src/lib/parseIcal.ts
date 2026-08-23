/**
 * Parses the Meetup group's public iCal feed.
 *
 * Shared by two callers so the crawler-facing snapshot and the live list can
 * differ in age but never in content:
 *   scripts/generate-events.mjs — writes data/eventsSnapshot.generated.ts
 *   src/worker/index.ts         — serves /api/events
 *
 * Node loads this file directly by stripping types (24.x), so keep to erasable
 * syntax: no enum, no namespace, no parameter properties.
 */

/** Where the feed's wall-clock times are written. Meetup sends this as TZID. */
const DEFAULT_TIME_ZONE = 'America/Los_Angeles';

export interface HumanistEvent {
  id: string;
  title: string;
  /** Local wall-clock date, 'YYYY-MM-DD'. What the card shows. */
  date: string;
  /** Local wall-clock time, '10:00 AM'. Absent for all-day events. */
  time?: string;
  /** ISO 8601 with offset. Feeds schema.org startDate. */
  startsAt: string;
  /** ISO 8601 with offset. What "past event" is measured against. */
  endsAt: string;
  description?: string;
  url?: string;
  urlLabel?: string;
}

interface Property {
  name: string;
  params: Record<string, string>;
  value: string;
}

/**
 * RFC 5545 folds long lines by breaking them and indenting the continuation
 * with a space or tab. Unfolded here first because a folded URL or DESCRIPTION
 * is otherwise read as two properties, and the permalink comes out truncated.
 */
function unfold(text: string): string {
  return text.replace(/\r?\n[ \t]/g, '');
}

/** Reverses RFC 5545 text escaping. Order matters: backslash last. */
function unescapeText(value: string): string {
  return value
    .replace(/\\n/gi, '\n')
    .replace(/\\,/g, ',')
    .replace(/\\;/g, ';')
    .replace(/\\\\/g, '\\');
}

function parseProperty(line: string): Property | undefined {
  const colon = line.indexOf(':');
  if (colon === -1) return undefined;

  const head = line.slice(0, colon);
  const value = line.slice(colon + 1);
  const [name, ...paramParts] = head.split(';');

  const params: Record<string, string> = {};
  for (const part of paramParts) {
    const equals = part.indexOf('=');
    if (equals === -1) continue;
    params[part.slice(0, equals).toUpperCase()] = part.slice(equals + 1);
  }

  return { name: name.toUpperCase(), params, value };
}

/** Offset for an instant in a zone, as '+HH:MM' / '-HH:MM'. */
function zoneOffset(instant: Date, timeZone: string): string {
  const name = new Intl.DateTimeFormat('en-US', {
    timeZone,
    timeZoneName: 'longOffset',
  })
    .formatToParts(instant)
    .find((part) => part.type === 'timeZoneName')?.value;

  // 'GMT-07:00' -> '-07:00'. Bare 'GMT' means UTC.
  const offset = name?.replace('GMT', '').trim() ?? '';
  return offset === '' ? '+00:00' : offset;
}

function offsetMinutes(instant: Date, timeZone: string): number {
  const match = /^([+-])(\d{2}):(\d{2})$/.exec(zoneOffset(instant, timeZone));
  if (!match) return 0;
  const sign = match[1] === '-' ? -1 : 1;
  return sign * (Number(match[2]) * 60 + Number(match[3]));
}

interface Moment {
  /** 'YYYY-MM-DD' as written in the feed. */
  date: string;
  /** 'HH:MM' 24-hour as written in the feed, absent for all-day values. */
  clock?: string;
  /** ISO 8601 with offset. */
  iso: string;
  epochMs: number;
}

/**
 * Reads a DTSTART/DTEND value in any of the three forms Meetup can send:
 * '20260913T100000' with a TZID param, the same with a trailing Z for UTC, or
 * a bare '20260913' for an all-day event.
 */
function parseMoment(property: Property): Moment | undefined {
  const match = /^(\d{4})(\d{2})(\d{2})(?:T(\d{2})(\d{2})(\d{2})(Z)?)?$/.exec(
    property.value.trim(),
  );
  if (!match) return undefined;

  const [, year, month, day, hour, minute, second, utc] = match;
  const date = `${year}-${month}-${day}`;

  if (!hour) {
    // All-day: midnight in the event's zone.
    const zone = property.params.TZID ?? DEFAULT_TIME_ZONE;
    const iso = withOffset(date, '00:00:00', zone);
    return { date, iso, epochMs: Date.parse(iso) };
  }

  const clock = `${hour}:${minute}:${second}`;

  if (utc) {
    const iso = `${date}T${clock}Z`;
    return { date, clock: `${hour}:${minute}`, iso, epochMs: Date.parse(iso) };
  }

  const zone = property.params.TZID ?? DEFAULT_TIME_ZONE;
  const iso = withOffset(date, clock, zone);
  return { date, clock: `${hour}:${minute}`, iso, epochMs: Date.parse(iso) };
}

/**
 * Attaches the zone's real offset to a wall-clock time, so the instant does not
 * shift for a reader in another timezone.
 *
 * The offset depends on the instant, which depends on the offset. Reading the
 * wall-clock time as UTC and correcting twice converges everywhere except
 * inside a DST transition hour.
 */
function withOffset(date: string, clock: string, timeZone: string): string {
  const [year, month, day] = date.split('-').map(Number);
  const [hour, minute, second] = clock.split(':').map(Number);
  const naive = Date.UTC(year, month - 1, day, hour, minute, second);

  let instant = naive;
  for (let pass = 0; pass < 2; pass += 1) {
    instant = naive - offsetMinutes(new Date(instant), timeZone) * 60_000;
  }

  return `${date}T${clock}${zoneOffset(new Date(instant), timeZone)}`;
}

/** '14:30' -> '2:30 PM'. The format the cards were written for. */
function displayTime(clock: string | undefined): string | undefined {
  if (!clock) return undefined;
  const [hour, minute] = clock.split(':').map(Number);
  const suffix = hour < 12 ? 'AM' : 'PM';
  const twelve = hour % 12 === 0 ? 12 : hour % 12;
  return `${twelve}:${String(minute).padStart(2, '0')} ${suffix}`;
}

/** 'event_315836966@meetup.com' -> 'event_315836966', safe in a URL fragment. */
function eventId(uid: string): string {
  return uid.split('@')[0].replace(/[^A-Za-z0-9_-]/g, '');
}

export interface ParseOptions {
  /** Events ending at or before this are dropped. Defaults to now. */
  now?: Date;
}

/**
 * Returns upcoming, non-cancelled events sorted earliest first.
 *
 * Throws on input that is not an iCalendar document, so a caller fetching an
 * error page instead of a feed fails loudly rather than publishing zero events.
 */
export function parseIcal(text: string, options: ParseOptions = {}): HumanistEvent[] {
  if (!text.includes('BEGIN:VCALENDAR')) {
    throw new Error('Not an iCalendar document: no BEGIN:VCALENDAR');
  }

  const cutoff = (options.now ?? new Date()).getTime();
  const events: HumanistEvent[] = [];

  let current: Property[] | undefined;
  for (const line of unfold(text).split(/\r?\n/)) {
    if (line === 'BEGIN:VEVENT') {
      current = [];
      continue;
    }
    if (line === 'END:VEVENT') {
      if (current) {
        const parsed = buildEvent(current, cutoff);
        if (parsed) events.push(parsed);
      }
      current = undefined;
      continue;
    }
    if (!current) continue;

    const property = parseProperty(line);
    if (property) current.push(property);
  }

  return events.sort((a, b) => a.startsAt.localeCompare(b.startsAt));
}

function buildEvent(properties: Property[], cutoff: number): HumanistEvent | undefined {
  const find = (name: string) => properties.find((property) => property.name === name);

  const uid = find('UID');
  const summary = find('SUMMARY');
  const dtstart = find('DTSTART');
  if (!uid || !summary || !dtstart) return undefined;

  if (find('STATUS')?.value.toUpperCase() === 'CANCELLED') return undefined;

  const start = parseMoment(dtstart);
  if (!start) return undefined;

  const dtend = find('DTEND');
  // Without DTEND the event is treated as ending when it starts, which is the
  // conservative read: it drops off the site no later than it should.
  const end = dtend ? parseMoment(dtend) : undefined;
  const endsAt = end ?? start;

  if (endsAt.epochMs <= cutoff) return undefined;

  const description = find('DESCRIPTION');
  const url = find('URL');

  return {
    id: eventId(uid.value),
    title: unescapeText(summary.value),
    date: start.date,
    ...(displayTime(start.clock) ? { time: displayTime(start.clock) } : {}),
    startsAt: start.iso,
    endsAt: endsAt.iso,
    ...(description ? { description: unescapeText(description.value) } : {}),
    ...(url ? { url: unescapeText(url.value) } : {}),
  };
}
