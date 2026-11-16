# Manual test: Zeffy integration 3 (live progress from the Zeffy API)

- Branch: `feat/zeffy-integration_3`, started from `feat/zeffy-integration_1`
  at `379131c` (so it has the link, the QR code and the header **Donate**
  button, but not the embedded form from integration 2)
- Preview: https://feat-zeffy-integration-3-sh-brief.klequis.workers.dev
  (follows the branch's latest commit). Locally, `pnpm dev` runs no server
  code, so the totals can't load there. Instead, in `app/`, run `pnpm build`,
  then `pnpm exec wrangler dev`, and open http://localhost:8787. Wrangler
  reads the Zeffy API key from `app/.dev.vars`.
- The Zeffy campaign is the organization's test campaign, "Text Campaign":
  $1,000 goal, $0 raised, no gifts yet.

## Steps

1. Go to the Donate section
   - Click **Donate** at the right end of the header
     - Expected: the page scrolls to the section headed Donate
   - Expected, from top to bottom: the short paragraph, then the line
     "$0 raised of our $1,000 goal", then an empty progress bar with a faint
     outline, then "No gifts yet. Yours could be the first.", then the blue
     **Donate on Zeffy** button with the QR code, then the grey note about
     Zeffy's tip
   - To judge: is "No gifts yet. Yours could be the first." the right
     wording?

2. Watch the totals load
   - Reload the page and go straight to the Donate section
     - Expected: for a moment it reads "Loading the latest totals…", then
       the $0 line replaces it

3. Check the message when the totals can't load
   - Stop `wrangler dev`. In `app/`, run `pnpm dev` and open
     http://localhost:3000
   - Go to the Donate section
     - Expected: in place of the totals it reads "Live totals are
       unavailable right now." No $0, no empty bar
   - Stop `pnpm dev` and start `pnpm exec wrangler dev` again

4. Check the phone width
   - Narrow the window to 320px
     - Expected: the raised line and the bar fit the width, with no
       sideways scrolling of the page

5. Optional: a real $1 gift
   - Click **Donate on Zeffy** and give $1 on Zeffy's form
   - Wait 5 minutes, then reload our page and go to the Donate section
     - Expected: "$1 raised of our $1,000 goal", a sliver of bar, and under
       **Latest gifts** a line reading `$1, ` and today's date. No name
   - To judge: does the gift show as $1, or $1 plus the tip you chose? (Zeffy's
     API reference doesn't say whether a payment's amount includes the tip)
   - Refund the gift in the Zeffy dashboard
     - Expected: within 5 minutes the gift is gone from **Latest gifts**. The
       raised amount may or may not drop, depending on how Zeffy counts
       refunds; note which

## Before this can work on the deployed site

6. Carl: in `app/`, run `pnpm wrangler secret put ZEFFY_API_KEY` and paste
   the key from `app/.dev.vars`. Until then the deployed site shows "Live
   totals are unavailable right now."
   - Failed 2026-11-15 on the preview (commit `63c9941`), after the key was
     added: the Donate section stayed on "Loading the latest totals…" through
     two reloads and ~2 minutes; the console showed
     `/api/donation-progress` returning 503.
     - Cause 1: the preview version was built before the key was added, so
       it didn't have it (`{"error":"zeffy_not_configured"}`). Fixed by the
       next push, which builds a new preview version with the key.
     - Cause 2: on a failed load the section never changed to "Live totals
       are unavailable right now." A change to `DonationProgress.tsx`
       (commit `e5558b3`, loads in `onMount`) didn't fix it.
   - Failed again 2026-11-15 (commit `e5558b3`): the API now answered, but the
     section still stayed on "Loading the latest totals…", in two browsers,
     with no console errors.
     - A change to `entry-prerender.tsx` (commit `5672e74`, one fewer
       component level so the prerendered hydration keys match the
       browser's) was needed but didn't fix it on its own.
   - Failed a third time 2026-11-15 (commit `5672e74`): same as above, the
     API answered but the section stayed on "Loading…".
     - Real cause: `vite.config.ts` loaded `solidPlugin()` without
       `{ ssr: true }`, so the browser code wasn't built for hydration.
       Whenever the address had a `#` part (`#donate`, `#/`, from clicking a
       menu link and then reloading), the browser kept the prerendered page
       and drew its updates into elements that weren't on the page. With no
       `#` part the router redrew the page, which hid the bug. This affects
       the whole site (on `main` too). Fixed in `vite.config.ts`; checked in
       jsdom with and without a `#` part. Retest this step, once with the
       address ending in `#donate`, and step 3.

## Things to judge

7. Is showing the latest gifts (amount and date only) a good idea for a
   small group, or should it be the total and the bar alone?
8. Zeffy's share kit also has a ready-made **thermometer** (an iframe from
   Zeffy, no key and no server code, but Zeffy's look and no gift list).
   Worth adding next to this to compare?
