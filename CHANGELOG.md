# Change log

Changes to the sh-brief repo (the Stanislaus Humanists website), newest first.
Each entry is dated by when it reached `main`, which is when it went live.
The log starts on 2026-11-19; for earlier changes, see `git log`.

## 2026-11-19: contact email is welcome@stanislaus-humanists.org

- The Contact section's email link and the organization's email in the
  search-engine data now show `welcome@stanislaus-humanists.org`, replacing
  `info@stanislaus-humanists.org`.
- The same change is on every branch not yet merged into `main`, so it won't
  be undone when they merge.
- Commit: `cdb756f`.

## 2026-11-19: plain #section links instead of the hash router

- Every link to a part of the page is now a plain `#section` link, and the
  browser does the scrolling. Addresses read `…/#membership`, not
  `…/#/membership`. Clicking a link for a section you've scrolled away from
  now always scrolls back to it.
- Old `#/section` addresses in posts and bookmarks still work: they are
  rewritten to `#section` and open at that section.
- The page now hydrates (the browser's JavaScript takes over the
  prerendered page), so the Upcoming Events list and the header highlight
  that marks the section you're in update on the live site. Before, they
  never did.
- `@solidjs/router` is removed.
- Commits: `8834e11`, `5c6d7e7`. Plan:
  `sh-brief-doc/feat-plain-anchors/plain-anchors-plan.md`.
