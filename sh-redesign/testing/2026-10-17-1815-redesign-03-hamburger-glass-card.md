# Manual test: redesign-03 (top bar with menu button, see-through event panel)

- Branch: `redesign-03`, based on `7dd5308` (redesign-02), changes uncommitted
- Preview: local only. Run `pnpm dev` in `app/`, open http://localhost:5173
- Compare with: `redesign-02`

## Phone (Samsung S25 in Firefox responsive mode, then 320px)

1. Top of page: logo + name + tagline on the left, menu button (☰) on the
   right, both white over the photo. Nothing above the photo.
2. The event panel is dark and see-through; the photo shows through it. The
   blue RSVP button is the brightest thing on screen.
3. When and where sit on one line under the event title (may wrap on narrow
   phones).
4. Without scrolling: headline, last get-together line, event, RSVP button,
   email link.
5. Tap ☰: a white panel drops down with the five links stacked; the icon turns
   into an X. The bar turns solid white while it's open.
6. Tap a link: the menu closes and the page scrolls to that section, heading
   not hidden under the bar.
7. Menu open → tap outside it: it closes.
8. Scroll past the photo: the bar turns solid white with dark text and stays at
   the top.

## Desktop (1280px+, then 760–900px)

9. Same top bar, with the five links inline on the right; no ☰ button.
10. Over the photo the links are white; the current section is underlined.
    Once the bar is solid, the links are blue.
11. Headline left, event panel right.

## Behavior

12. Keyboard: Tab reaches the brand, then the ☰ button (phone) or the links
    (desktop), then the RSVP button. Escape closes an open menu and returns
    focus to ☰.
13. "Home" scrolls to the very top.
14. Under the photo: "Also coming up" starts with the *second* event (no repeat
    of the hero's event), then "What is Humanism?"
15. Footer still shows the "No code was written…" line.

## Things to judge

16. Is the event panel now the right weight?
17. Hamburger on the right vs. left (one-line change if you want it left).
18. Is "Also coming up" the right heading?
