# Manual test: above-the-fold hero (Group 1 mockup)

- Branch: `redesign-01`, based on `9366fd7`, changes uncommitted
- Preview: local only. Run `pnpm dev` in `app/`, open http://localhost:5173
  (not deployed)
- Note: in local dev `/api/events` may not respond. The page then shows the
  build-time snapshot, so "Next get-together" should be Game Night, Sat, Oct 24.

## Phone (DevTools device mode: iPhone SE 375×667, then a 360px Android)

1. Without scrolling, you can see: the headline naming Modesto, the "Last
   get-together" line, the next event's title, date/time, venue, and the
   "RSVP — save me a seat" button.
2. "Not ready? Get the monthly email" is visible, or at most a small scroll
   away.
3. Headline and "Last get-together" text are readable over every part of the
   photo.
4. The RSVP button spans the card width and is easy to tap.
5. The photo credit sits bottom right and doesn't overlap the card.
6. No horizontal scrolling at 320px wide.

## Desktop (1280px+ wide)

7. Headline on the left, event card on the right, bottom edges roughly
   aligned.
8. The photo reads as a photo (faces visible), not just a dark band.
9. At 900–1100px the two columns still fit with no overlap.

## Behavior

10. The RSVP button and the email link open the mock ActionNetwork URLs in a
    new tab (they 404 there; that's expected).
11. Hovering the RSVP button darkens it; the text stays readable.
12. Tab through the page: focus reaches the RSVP button, then the email link,
    with a visible focus ring on the button.
13. Below the hero: "What is Humanism?", then "Upcoming Events" with the event
    cards as before.
14. Header nav links still scroll to the right sections; "Home" scrolls back
    to the top of the hero.
15. Footer shows the "No code was written…" line.

## Things to judge (not pass/fail)

16. Does the Stranger Test pass? Next event, what to wear, come alone? (The
    last two aren't answered yet; that's the Group 2 "Your first visit" page.)
17. Is the headline too long on a phone?
18. Is the "Last get-together … 14 of us were there" wording right?
