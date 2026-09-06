/**
 * Trims a feed DESCRIPTION down to one paragraph of plain text.
 *
 * Meetup descriptions are the full listing: the group name on the first line,
 * then markdown with speaker lists, emoji headers and links. That is fine in
 * the feed and unusable on a card, which has no markdown renderer and no line
 * clamp. The full text stays in the event data; only what is displayed is cut.
 */
import { siteConfig } from '../data/site';

/** Roughly four lines in a card. Long enough for a real blurb, short enough
 *  that one card cannot stretch the grid. */
const MAX_LENGTH = 220;

/** Meetup prefixes every description with the group's own name on line one. */
function dropGroupHeading(text: string): string {
  const heading = `${siteConfig.orgName}\n`;
  return text.startsWith(heading) ? text.slice(heading.length) : text;
}

function stripMarkdown(text: string): string {
  return text
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1') // [label](url) and images -> label
    .replace(/(\*\*|__)(.*?)\1/g, '$2') // bold
    .replace(/(^|\W)[*_](\S(?:.*?\S)?)[*_](\W|$)/g, '$1$2$3') // italic
    .replace(/`([^`]*)`/g, '$1')
    .replace(/^\s*[#>*-]+\s*/gm, '') // headings, quotes, list bullets
    .trim();
}

/** Cuts on a word boundary so the ellipsis never lands mid-word. */
function truncate(text: string): string {
  if (text.length <= MAX_LENGTH) return text;
  const cut = text.slice(0, MAX_LENGTH);
  const lastSpace = cut.lastIndexOf(' ');
  return `${(lastSpace > 0 ? cut.slice(0, lastSpace) : cut).replace(/[.,;:]$/, '')}…`;
}

export function eventSummary(description?: string): string | undefined {
  if (!description) return undefined;

  // First paragraph only. Meetup separates them with a blank line.
  const [firstParagraph = ''] = dropGroupHeading(description).split(/\n\s*\n/);
  const summary = truncate(stripMarkdown(firstParagraph).replace(/\s+/g, ' '));

  return summary.length > 0 ? summary : undefined;
}
