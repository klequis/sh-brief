# Manual test: Zeffy integration 1 (link and QR code)

- Branch: `feat/zeffy-integration_1`, based on main `c52f1cb`
- Preview: local only (not pushed). Run `pnpm dev` in `app/` and open
  http://localhost:3000
- The Zeffy campaign is the organization's test campaign, "Text Campaign".
  Its form is live, so finishing a gift charges a real card.

## Steps

1. Open the page and look at the menu
   - Expected: the menu reads Home · About Us · About Humanism · Membership ·
     Donate · Contact
   - Expected: at phone width and at 760–1100px, the extra link doesn't make
     the menu wrap badly or overlap the logo

2. Go to the Donate section
   - Click **Donate** in the menu
     - Expected: the page scrolls to a section headed Donate, just below
       Membership, and the heading isn't hidden under the menu bar
     - Expected: **Donate** is the highlighted menu link
   - Expected: the Donate section has a white background. Contact, below it,
     now has the grey background (changed so the sections keep alternating
     grey and white)

3. Read the Donate section
   - Expected, from top to bottom: a short paragraph, a blue **Donate on Zeffy**
     button with a QR code to its right (below it on a phone), the caption "Or
     scan with your phone's camera", then a small grey note about Zeffy's
     optional tip
   - To judge: the paragraph ("Gifts pay for meeting space, events and
     outreach…") is placeholder copy I wrote. Is it accurate?
   - To judge: is the note "you can set the tip to $0" true for Zeffy's
     current checkout? (I haven't seen the checkout)

4. Use the button
   - Click **Donate on Zeffy**
     - Expected: a new tab opens on Zeffy's "Text Campaign" donation form;
       the site stays open in the first tab
   - Close the Zeffy tab without giving

5. Scan the QR code
   - Point your phone's camera at the QR code on screen
     - Expected: it offers the link `zeffy.com/donation-form/text-campaign`,
       and opening it shows the same form as step 4

6. Use the keyboard
   - Press Tab from the menu until focus reaches the Donate section
     - Expected: **Donate on Zeffy** gets a visible focus style (light blue
       background, dark text)
   - Press Enter
     - Expected: same as step 4

## Things to judge

7. Placement: Donate as its own section after Membership, or somewhere else
   (for example next to Membership, or a button in the menu bar)?
8. Is the QR code worth showing on the site, or only on flyers?
