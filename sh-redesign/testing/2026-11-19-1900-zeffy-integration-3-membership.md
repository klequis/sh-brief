# Manual test: Zeffy membership version of the site (Join)

- Branch: `feat/zeffy-integration_3_membership`, started from
  `feat/zeffy-integration_3`. This version of the site asks people to join,
  not to donate: the header button says **Join** and there is no Donate
  section.
- Preview: none yet (the branch isn't pushed). Locally: in `app/`, run
  `pnpm dev` and open http://localhost:3000.
- The Zeffy campaign is "Stanislaus Humanists Membership", a membership form
  with two rates: Individual Membership $24, Family Membership $36. **It is
  live: completing checkout charges a real card.** Stop before paying.

## Steps

1. Look at the header
   - Expected: the blue button at the right end of the header says **Join**
   - Expected: the menu has no **Donate** and no **Membership** item
   - Click **Join**
     - Expected: the page scrolls to the section headed Membership

2. Read the Membership section
   - Expected: the prices read "Individual: $24 / year" and "Family: $36 /
     year" (it said "Couples" before, which didn't match Zeffy)
   - Expected: "Membership runs on a February 1 – January 31 cycle." with
     nothing about proration
   - Expected, under the paragraph that ends "Members may also serve on the
     Board.": a blue **Join on Zeffy** button, a QR code with "Or scan with
     your phone's camera" under it, then a grey note starting "Memberships
     are handled by Zeffy"
   - Expected: then the heading Our Seven Core Principles, as before

3. Open the membership form
   - Click **Join on Zeffy**
     - Expected: a new tab opens on Zeffy's "Stanislaus Humanists
       Membership" page, with Individual Membership $24 and Family
       Membership $36
   - Close that tab

4. Scan the QR code in the Membership section
   - Scan it with your phone's camera
     - Expected: the same Zeffy membership page opens on the phone

5. Check there's no Donate section
   - Scroll from Membership to the bottom of the page
     - Expected: Membership is followed directly by Contact; there is no
       section headed Donate
