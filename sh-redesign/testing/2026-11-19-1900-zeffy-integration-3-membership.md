# Manual test: Zeffy integration 3, membership (Join on Zeffy)

- Branch: `feat/zeffy-integration_3_membership`, started from
  `feat/zeffy-integration_3`. Commit `56ed227`.
- Preview: none yet (the branch isn't pushed). Locally: in `app/`, run
  `pnpm dev` and open http://localhost:3000.
- The Zeffy campaign is "Stanislaus Humanists Membership", a membership form
  with two rates: Individual Membership $24, Family Membership $36. **It is
  live: completing checkout charges a real card.** Stop before paying.

## Steps

1. Go to the Membership section
   - Expected, under the paragraph that ends "Members may also serve on the
     Board.": a blue **Join on Zeffy** button, a QR code with "Or scan with
     your phone's camera" under it, then a grey note starting "Memberships
     are handled by Zeffy"
   - Expected: then the heading Our Seven Core Principles, as before

2. Open the membership form
   - Click **Join on Zeffy**
     - Expected: a new tab opens on Zeffy's "Stanislaus Humanists
       Membership" page, with Individual Membership $24 and Family
       Membership $36
   - Close that tab

3. Scan the QR code in the Membership section
   - Scan it with your phone's camera
     - Expected: the same Zeffy membership page opens on the phone

4. Check the Donate section didn't change
   - Go to the Donate section
     - Expected: the same as before: "$0 raised of our $1,000 goal", the
       progress bar, "No gifts yet. Yours could be the first.", the
       **Donate on Zeffy** button, the QR code and the note starting
       "Donations are handled by Zeffy"
   - Click **Donate on Zeffy**
     - Expected: a new tab opens on Zeffy's donation page ("Test Campaign"),
       not the membership form
