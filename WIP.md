# Work in progress

Last updated: 2026-11-19

Two tracks, both started from the AHA *Humanist Organizer Playbook* (2026, Jake
Via):

1. **Site redesign:** rebuild the Stanislaus Humanists homepage so a newcomer on
   a phone can see, without scrolling, that we're real and current, when and
   where we meet next, and the one thing to do next.
2. **Front Porch Tune-up:** a checklist any local humanist group can use to
   check and improve its own website. Meant to be shared with Jake and other
   groups.

## Waiting on Carl

- Front Porch Tune-up: pick the 8–10 real group sites for the hand trial
  (decision 4 in `fabel-front-pourch-tune-up.md`).
- Front Porch Tune-up: revise the "Why" line under "Any other item can be set
  aside" (TODO in the doc).
- Front Porch Tune-up: decide whether to cite p.21 next to the "several aren't
  out to family or employers" example.
- Push `redesign-01` and `redesign-02`, or keep them local? (Open questions)
- Zeffy, yearly-donation site (`feat/zeffy-integration_3_yearly-donation`,
  https://feat-zeffy-integration-3-yearly-donation-sh-brief.klequis.workers.dev):
  create a new Zeffy donation form with only **Yearly** turned on (steps in
  the remaining-work doc below), then send Claude its link. Until then the
  site points at "Test Campaign", which offers one-time and monthly gifts.
- Zeffy, membership site (`feat/zeffy-integration_3_membership`,
  https://feat-zeffy-integration-3-membership-sh-brief.klequis.workers.dev):
  1. Say how long a membership lasts on the "Stanislaus Humanists
     Membership" form in Zeffy: 365 days from joining, or ending every
     January 31. The site still says "February 1 – January 31 cycle".
  2. Run the checklist
     `sh-redesign/testing/2026-11-19-1900-zeffy-integration-3-membership.md`
     (on that branch).
- Zeffy, both sites: confirm the wording, then pick one of the two sites and
  say when to merge it into `main`. Remaining work:
  `~/P/sh-brief-doc/payment-system/zeffy-implementation/zeffy-integration-remaining-work.md`.

## In progress

- Site redesign: `redesign-03` is the current direction. Next is `redesign-04`
  (menu rename, "Your first visit" page). See section 1.
- Front Porch Tune-up: design draft, critiqued 2026-11-14. Next is the
  11-step plan in `~/P/sh-brief-doc/front-porch-tune-up/fabel-front-pourch-tune-up.md`:
  split the README into worksheet, design notes and tool spec; add the
  Being found section; then the prompt pack and dry runs. See section 2.
- Zeffy integration: two final example sites, both built on integration 3
  (live totals from the Zeffy API) and both pushed with previews:
  `feat/zeffy-integration_3_yearly-donation` (says **Donate**, a yearly gift
  that repeats until cancelled) and `feat/zeffy-integration_3_membership`
  (says **Join**, no Donate section). Waiting on Carl (above). See
  `~/P/sh-brief-doc/payment-system/zeffy-implementation/zeffy-integration-remaining-work.md`.

---

## 1. Site redesign

**How we work:** each design variation is its own branch, `redesign-NN`, built
on the one before. The demo uses placeholder content (stock photos, mock
ActionNetwork and Zeffy links, made-up turnout numbers), all in
`app/src/data/demoContent.ts`. Migration to Squarespace is ignored for now.

| Branch | What it tried | State |
|---|---|---|
| `redesign-01` | Full-bleed photo hero: town-first headline, "Last get-together" line, next-event card with one RSVP button | Committed, local only |
| `redesign-02` | Logo and name moved onto the photo, menu bar under it, events above "What is Humanism?" | Committed, local only |
| `redesign-03` | See-through top bar (menu button on phones, links on desktop) that turns solid on scroll; dark see-through event panel; event list starts after the hero's event | Committed, **pushed** |

**Current direction:** `redesign-03`. Feedback so far: the menu works, and not
repeating the hero's event in the list works.

**Next iteration (`redesign-04`):**

1. Rename the menu to *Events · Your first visit · About us · Join · Donate*.
2. Build the "Your first visit" page: what to wear, coming alone, what
   happens. It's the biggest gap the Tune-up finds in `redesign-03`.

**Planning docs** (moved 2026-11-14 to
`~/P/sh-brief-doc/front-porch-tune-up/redesign/`):

- `initial-redesign-ideas.md`: everything the playbook says about websites,
  ideas N1–N46, decisions, and Groups 1–3 (Group 1, above the fold, is done).
- `sh-to-squarespace-migration.md`: what a later move to Squarespace would
  involve.
- `donation-platform-options.md`: choosing one donation platform (separate
  project).
- `testing/`: one manual test checklist per redesign round. (The Zeffy
  checklists stay in `sh-redesign/testing/` on their own branches until those
  branches are merged.)

## 2. Front Porch Tune-up

**Docs:** everything for the Tune-up and the redesign now lives in
`~/P/sh-brief-doc/front-porch-tune-up/`:

- [README.md](../sh-brief-doc/front-porch-tune-up/README.md): the Tune-up
  design draft (sections, points, ratings).
- [fabel-front-pourch-tune-up.md](../sh-brief-doc/front-porch-tune-up/fabel-front-pourch-tune-up.md):
  2026-11-14 critique and the proposals for finishing it.
- [jake-aha-website-recommendations.md](../sh-brief-doc/front-porch-tune-up/jake-aha-website-recommendations.md):
  the playbook's website and SEO advice, summarized.
- `redesign/`: the redesign planning docs and test checklists.

**What's decided:**

- Two sections: **First screen** (60 points, measured at 360 × 640) and
  **First 30 seconds** (40 points). Accessibility and "porch upkeep" come later.
- Each section has a few must-haves, shown first as a count. A section can't
  rate above Good until they're all there.
- Points, never pass/fail. Ratings by share of possible points.
- Organizers answer three questions first: what neighbors call where they
  live, who they're trying to reach, and which items don't fit them.
- Any item except a must-have can be set aside, with a visible reason.

**On hold:**

- Renaming the ratings. Current: *Getting started / Good / Better / Best*.
  Proposed: *Getting started / On your way / Almost there / Ready for visitors*.

**Decided 2026-11-14** (details in `fabel-front-pourch-tune-up.md`): a third
section, **Being found**, 20 points, total 120; every tune-up's next steps
split into two lists, *Being found: clear, solid SEO recommendations* and
*Other front porch improvements*; the prompt pack supports Claude, ChatGPT and
Gemini; Jake is not considered for now.

**Next:**

1. Carl: pick the 8–10 real group sites for the hand trial.
2. Carl: revise the "Why" line under "Any other item can be set aside"
   (marked with a TODO in the doc).
3. Decide whether to cite p.21 next to the "several aren't out to family or
   employers" example.
4. Claude: steps 2–5 of the plan (split the README, add Being found, write
   check-it and fix-it lines, build the prompt pack), then dry runs with Carl.

## Open questions

1. Push `redesign-01` and `redesign-02`, or keep them local?
