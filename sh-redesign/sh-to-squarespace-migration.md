# Migrating the site to Squarespace

**The rule:** the migration can't be automated. Content moves semi-automatically;
pages get rebuilt by hand in the Squarespace editor. Do the redesign here, but
only with things Squarespace can build natively, or the design won't survive
the move.

Goal: hand the site's maintenance to a less technical volunteer (the playbook's
"Greg" problem, PB p.24). Related: [initial-redesign-ideas.md](initial-redesign-ideas.md),
Part 4, decision 1.

## Why it can't be automated

- **Squarespace's importer only brings in blog posts.** It takes posts and
  products from WordPress, Blogger, Shopify and similar, not page layouts.
  [UT wiki][ut]
- **No page-building API.** Squarespace's developer APIs cover commerce
  (orders, products, inventory). There's no public API to create pages.

## What carries over easily

The site is small: five sections, the FAQs, the board. A manual rebuild is about
a day's work if everything is prepared first. Claude prepares:

1. A migration packet: each page's final text split into Squarespace blocks,
   plus optimized images with alt text.
2. An old-URL → new-URL map for Squarespace's URL Mappings (redirects).
3. Short "how to" checklists for the new maintainer: post the monthly update,
   add a venue, change the next event if the feed isn't used.

## What doesn't carry over cleanly

### The automatic Meetup calendar (the big one)

Squarespace can't read the Meetup iCal feed. The calendar is the playbook's #1
sign of life (PB p.21), so choose deliberately:

| Option | Cost | Greg-free? |
|---|---|---|
| Link to Meetup ("See upcoming events") | Free | Yes, but no dates on our own page |
| Third-party Meetup widget | Paid subscription | Yes, if the vendor lasts |
| Keep a small Cloudflare script that the Squarespace page embeds | Free | **No.** Brings back a piece Carl maintains |
| Post events in a Squarespace Events page by hand | Free | Yes, but the calendar goes stale the first month someone forgets |
| Move RSVPs to ActionNetwork and embed its event widget | Free (AHA provides it) | Yes. Also what the playbook recommends (PB p.39) |

### Custom code needs the Core plan

The JSON-LD structured data and any embedded widget need **code injection**,
which isn't on Basic. Core is the cheapest plan with it. [Beyondspace][bs]

### Cost

The playbook says "$20 annual fee" (PB p.24); it's per **month**. Current
prices, billed annually: about **$19/mo Basic**, about **$29/mo Core**, so
roughly **$230–350 a year**. Sources disagree slightly; confirm in the account
before the board decides. [superdupr][sd], [PricingSaaS][ps]

## Ideas from the redesign doc that won't survive the move

These depend on custom code. Under Squarespace, drop them or replace them with
a manual habit.

| Idea | Squarespace replacement |
|---|---|
| N1 Automatic "last gathering" line | Manual monthly update |
| N2 Fallback when no event is scheduled, plus organizer alert | None; rely on the monthly checklist |
| N3 Monthly "porch sweep" reminder email | A recurring calendar reminder for two organizers |
| N16 Self-refreshing photo strip | Manually update a gallery block |
| N18 Button that changes for returning visitors | One fixed button |
| N44 Non-coder editing of a custom site | Not needed: Squarespace *is* the non-coder editor |
| N46 Automated checks (town named, future event, alt text) | Run the Stranger Test (PB p.26) quarterly |

Everything else in the redesign doc is buildable with Squarespace's standard
blocks: text, buttons, forms, newsletter signup, gallery, video, events, and the
pages themselves.

## Plan

1. Settle the calendar option above. It's the only choice that changes the
   design.
2. Redesign here, limited to Squarespace-native elements.
3. Board approves the plan and its yearly cost.
4. Claude produces the migration packet, URL map and maintainer checklists.
5. Rebuild in Squarespace; two people get admin access (PB p.24).
6. Run the Stranger Test on the Squarespace version before switching the domain.
7. Point the domain at Squarespace; keep the Cloudflare version until the new
   site has run for a month.

[ut]: https://cloud.wikis.utexas.edu/wiki/spaces/mis374kx/pages/27035283/SquareSpace
[bs]: https://beyondspace.studio/qanda/which-squarespace-plans-include-code-injection-in-2025
[sd]: https://superdupr.com/blog/squarespace-pricing.md
[ps]: https://pricingsaas.com/companies/squarespace
