# Manual test: Zeffy integration 2 (embedded form)

- Branch: `feat/zeffy-integration_2`, started from `feat/zeffy-integration_1`
  at `379131c` (so it has the Donate section and the header **Donate** button)
- Preview: local only (not pushed). Run `pnpm dev` in `app/` and open
  http://localhost:3000
- The Zeffy campaign is the organization's test campaign, "Text Campaign".
  Its form is live, so finishing a gift charges a real card. Don't press the
  form's final pay button unless you mean to give $1 and refund it in Zeffy.

## Steps

1. Go to the Donate section
   - Click **Donate** at the right end of the header
     - Expected: the page scrolls to the section headed Donate
   - Expected, from top to bottom: the short paragraph, then Zeffy's donation
     form, then the line "Prefer to give on Zeffy's own page, or from your
     phone?", then the blue **Donate on Zeffy** button with the QR code, then
     the grey note about Zeffy's tip

2. Watch the form load
   - Reload the page and go straight to the Donate section
     - Expected: for a moment, a dashed box reading "Loading the donation
       form…" holds the form's place
     - Expected: Zeffy's form replaces the box, and the page doesn't jump
       much when it does
   - Expected: the form is no wider than the paragraph above it on a desktop

3. Fill in the form without paying
   - In Zeffy's form, choose an amount
   - Go as far as the step that asks for card details, then stop
     - Expected: every step stays inside our page; nothing opens a new tab
   - Reload the page to clear the form

4. Check the form on a phone-width window
   - Narrow the window to about 375px
     - Expected: the form fits the width, with no sideways scrolling of the
       page
   - Narrow it to 320px
     - Expected: same as above

5. Check what happens when Zeffy's script can't load
   - Open the browser's developer tools, Network tab. Right-click any request
     and choose **Block request URL**, then edit the blocked pattern to
     `zeffy-embed.js` (Chrome: the **Network request blocking** panel; Firefox:
     **Block URL**)
   - Reload the page and go to the Donate section
     - Expected: in place of the form is Zeffy's form in a plain frame, 450px
       tall; it may need scrolling inside the frame
     - Expected: no "Loading the donation form…" box is left behind
   - Remove the block and reload
     - Expected: the normal form is back

6. Use the link and QR code under the form
   - Click **Donate on Zeffy**
     - Expected: a new tab opens on Zeffy's "Text Campaign" donation form;
       the site stays open in the first tab
   - Close the Zeffy tab without giving
   - Point your phone's camera at the QR code
     - Expected: it offers `zeffy.com/donation-form/text-campaign`

## Things to judge

7. With the form on the page, do the **Donate on Zeffy** button and the QR
   code still earn their place under it, or should they go (or move to
   flyers only)?
8. Is the form's look acceptable next to the rest of the site? We can't
   restyle it: Zeffy draws it.
9. Compare with Zeffy integration 1
   (`sh-redesign/testing/2026-11-14-1631-zeffy-integration-1-link-and-qr.md`):
   embedded form, or just the link?
