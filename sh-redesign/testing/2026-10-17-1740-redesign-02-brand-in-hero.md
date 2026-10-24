# Manual test: redesign-02 (brand in the hero, menu below it)

- Branch: `redesign-02`, based on `a0b5cca` (redesign-01), changes uncommitted
- Preview: local only. Run `pnpm dev` in `app/`, open http://localhost:5173
- Compare with: `redesign-01` (`git switch redesign-01`)

## Phone (DevTools: iPhone SE 375×667, then 360px and 320px)

1. Nothing sits above the photo: the page starts with the photo.
2. At the top of the photo: logo, "Stanislaus Humanists", "science | art |
   compassion", readable in white.
3. Without scrolling: the headline, the "Last get-together" line, and the next
   event's title, date/time, venue and RSVP button.
4. The menu bar is directly under the photo, with the pills wrapping to at most
   two rows down to 340px.
5. Scroll down: the menu bar sticks to the top of the screen once the photo is
   gone.
6. No horizontal scrolling at 320px.

## Desktop (1280px+, then 900–1100px)

7. Brand top-left on the photo, with clear space between it and the headline.
8. Headline left, event card right; menu bar centered under the photo.
9. The menu is a single row.

## Behavior

10. Menu "Home" scrolls all the way to the top (photo visible), not to the
    events.
11. Every other menu link lands its section heading just under the sticky menu,
    not hidden behind it.
12. The active menu pill follows as you scroll through the sections.
13. Clicking the logo/name goes to the top.
14. Under the menu: "Upcoming Events" first, then "What is Humanism?"
15. Footer still shows the "No code was written…" line.

## Things to judge

16. With the brand added, does the RSVP button still fit above the fold on a
    small phone?
17. Is the sticky menu bar, with no logo in it, enough branding while you
    scroll?
