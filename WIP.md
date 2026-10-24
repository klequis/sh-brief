# Work in progress

Last updated: 2026-10-23

Two tracks, both started from the AHA *Humanist Organizer Playbook* (2026, Jake
Via):

1. **Site redesign:** rebuild the Stanislaus Humanists homepage so a newcomer on
   a phone can see, without scrolling, that we're real and current, when and
   where we meet next, and the one thing to do next.
2. **Front Porch Tune-up:** a checklist any local humanist group can use to
   check and improve its own website. Meant to be shared with Jake and other
   groups.

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

**Planning docs** (in `sh-redesign/`):

- `initial-redesign-ideas.md`: everything the playbook says about websites,
  ideas N1–N46, decisions, and Groups 1–3 (Group 1, above the fold, is done).
- `sh-to-squarespace-migration.md`: what a later move to Squarespace would
  involve.
- `donation-platform-options.md`: choosing one donation platform (separate
  project).
- `testing/`: one manual test checklist per round.

## 2. Front Porch Tune-up

**Doc:** [front-porch-tune-up/README.md](front-porch-tune-up/README.md), design
draft.

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

**Next:**

1. Carl: revise the "Why" line under "Any other item can be set aside"
   (marked with a TODO in the doc).
2. Decide whether to cite p.21 next to the "several aren't out to family or
   employers" example.
3. Try the tune-up by hand on 8–10 real humanist group sites, with a real
   Stranger Test on three, then adjust the numbers.

## Open questions

1. Push `redesign-01` and `redesign-02`, or keep them local?
