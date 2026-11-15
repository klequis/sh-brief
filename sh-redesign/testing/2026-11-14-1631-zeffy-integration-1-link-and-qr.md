# Manual test: Zeffy integration 1 (link and QR code)

- Branch: `feat/zeffy-integration_1`, based on main `c52f1cb`. The header
  **Donate** button is on top of `50c9c2d`, not committed yet
- Preview: local only (not pushed). Run `pnpm dev` in `app/` and open
  http://localhost:3000
- The Zeffy campaign is the organization's test campaign, "Text Campaign".
  Its form is live, so finishing a gift charges a real card.

## Steps

1. Open the page and look at the header
   - Expected: the menu pills read Home · About Us · About Humanism ·
     Membership · Contact (no Donate pill)
   - Expected: at the right end of the header is a filled blue **Donate**
     button, square-cornered, not round like the pills
   - Expected: above 1100px wide, logo, pills and button are on one row,
     with the button at the far right

2. Check the header at phone and tablet widths
   - Narrow the window to about 760px
     - Expected: the logo and name are on the top row with **Donate** at the
       right end of that row; the pills are on the row below
   - Narrow it to about 375px, then 320px
     - Expected: **Donate** is still on the top row, next to the name, not
       down among the pills
     - Expected: below about 400px, "Stanislaus Humanists" may wrap onto two
       lines beside the logo. To judge: does that look all right?

3. Go to the Donate section with the header button
   - Scroll back to the top. Click **Donate** in the header
     - Expected: the page scrolls to a section headed Donate, just below
       Membership, and the heading isn't hidden under the header
     - Expected: no menu pill is highlighted while the Donate section is on
       screen
   - Scroll down a little to Contact
     - Expected: the **Contact** pill is highlighted
   - Click **Donate** in the header again
     - Expected: the page scrolls back to the Donate section
   - Expected: the Donate section has a white background. Contact, below it,
     now has the grey background (changed so the sections keep alternating
     grey and white)

4. Read the Donate section
   - Expected, from top to bottom: a short paragraph, a blue **Donate on Zeffy**
     button with a QR code to its right (below it on a phone), the caption "Or
     scan with your phone's camera", then a small grey note about Zeffy's
     optional tip
   - To judge: the paragraph ("Gifts pay for meeting space, events and
     outreach…") is placeholder copy I wrote. Is it accurate?
   - To judge: is the note "you can set the tip to $0" true for Zeffy's
     current checkout? (I haven't seen the checkout)

5. Use the button
   - Click **Donate on Zeffy**
     - Expected: a new tab opens on Zeffy's "Text Campaign" donation form;
       the site stays open in the first tab
   - Close the Zeffy tab without giving

6. Scan the QR code
   - Point your phone's camera at the QR code on screen
     - Expected: it offers the link `zeffy.com/donation-form/text-campaign`,
       and opening it shows the same form as step 5

7. Use the keyboard
   - Press Tab from the **Contact** pill
     - Expected: focus moves to the header **Donate** button, which turns
       light blue with dark text
   - Press Tab from the header **Donate** button until focus reaches the
     Donate section
     - Expected: **Donate on Zeffy** gets a visible focus style (light blue
       background, dark text)
   - Press Enter
     - Expected: same as step 5

## Things to judge

8. Placement: Donate as its own section after Membership, reached from the
   **Donate** button in the header. Does that work, or should the section
   move (for example next to Membership)?
9. Is the QR code worth showing on the site, or only on flyers?
