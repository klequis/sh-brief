# Backlinks to `stanislaushumanists.org`

**Compiled 2026-08-17.** Companion to
[recover-domain.md](../../Documents/misc/sh-brief-doc/recover-domain/recover-domain.md)
— §1 notes the old domain holds ~13 years of accumulated inbound links. This is
an inventory of the ones that are findable from public search.

> **This list is not complete and cannot be made complete from web search.**
> Search engines expose only a fraction of inbound links. See
> [§4 Getting the real list](#4-getting-the-real-list) for the tools that
> actually enumerate backlinks.

---

## 1. Confirmed — link verified by fetching the page

| Site | Linking page | Link as published | Who controls it |
|---|---|---|---|
| Meetup | [meetup.com/stanislaus-humanists](https://www.meetup.com/stanislaus-humanists/) | `http://stanislaushumanists.org` in the group description ("visit our website is http://stanislaushumanists.org") | **Us** — editable by a Meetup organizer |
| chistodex.com | [chistodex.com](https://chistodex.com/) | `https://stanislaushumanists.org`, link text "stanislaushumanists.org" | Chris (personal site; bio lists him as Member & Webmaster) — ask directly |

## 2. Reported by search, page not directly readable

Each of these appears in search-index snippets citing the old domain, but the
page itself returned an error, a paywall, or a login wall when fetched, so the
live link text could not be confirmed. Verify by hand in a browser.

| Site | Linking page | What the index shows | Who controls it | Fetch result |
|---|---|---|---|---|
| United CoR | [unitedcor.org/stanislaus-humanists](https://unitedcor.org/stanislaus-humanists/) | "…learn more at StanislausHumanists.org" | Third party — **contact them**, this is a real directory citation worth redirecting | HTTP 500 |
| Facebook page | [facebook.com/StanislausHumanists](https://www.facebook.com/StanislausHumanists/) | Page's website field | **Us** — page admin | Login wall |
| Facebook group | [facebook.com/groups/humanisthall](https://www.facebook.com/groups/humanisthall/) | Group description / about | **Us** — group admin | Login wall |
| X / Twitter | [x.com/StanHumanists](https://x.com/StanHumanists) | Profile website field | **Us** — account holder | HTTP 402 |
| X / Twitter | [twitter.com/troyspearsesq](https://twitter.com/troyspearsesq) | Posts (c. 2014) linking to specific `stanislaushumanists.org` blog posts | Troy Spears — see [letter-to-troy-spears.md](../../Documents/misc/sh-brief-doc/recover-domain/letter-to-troy-spears.md) | Not fetched |
| YouTube | [youtube.com/@stanislaushumanists](https://www.youtube.com/@stanislaushumanists) | Channel description / channel links | **Us** — channel owner | Page returned nav chrome only |
| Square | [stanislaus-humanists-inc.square.site](https://stanislaus-humanists-inc.square.site/) | Donation site, likely links back | **Us** — Square account | Empty response |

## 3. Checked and found *not* to link

Recording these so they are not re-checked. Each surfaced in search results for
the old domain but contains no link to it.

- [users.drew.edu/~jlenz/humanism.html](https://users.drew.edu/~jlenz/humanism.html) — Humanism and Freethought Sites index
- [library.meadville.edu/humanism_guide/organizations](https://library.meadville.edu/humanism_guide/organizations) — Meadville Lombard humanist org guide
- [shadowpuppets.substack.com/p/resources](https://shadowpuppets.substack.com/p/resources)
- [bizprofile.net/ca/modesto/stanislaus-humanists-inc](https://www.bizprofile.net/ca/modesto/stanislaus-humanists-inc) — CA SoS filing data only, no website field
- `projects.propublica.org/nonprofits/organizations/331028608` — **wrong organization.** That EIN (33-1028608) is *St Stanislaus Benevolent Society*. SHI's EIN appears to be **46-4159233** (per the AmazonSmile link `smile.amazon.com/ch/46-4159233` published on the old site) — unverified against IRS records.

Not reachable at all, worth a manual look: `causeiq.com` (HTTP 403),
`getholdings.com` (HTTP 404).

### Not backlinks, but same-domain

- `stanislaushumanists.wildapricot.org` — the Wild Apricot platform subdomain
  serving the old site itself. Not an inbound link; part of the property.
- `smile.amazon.com/ch/46-4159233` — AmazonSmile was shut down in 2023. Dead.

## 4. Getting the real list

Web search finds citations, not backlinks. To enumerate them properly, in
rough order of usefulness given we **do not control the old domain**:

1. **Free third-party backlink checkers** — the only option that needs no access
   to the old property. Ahrefs Backlink Checker, Moz Link Explorer, and Semrush
   all give a limited free report for any domain. Run all three; their indexes
   differ. Start here.
2. **Bing Webmaster Tools / Google Search Console** — the authoritative list,
   but both require verifying ownership of `stanislaushumanists.org`, which is
   exactly what we don't have. Available only if the domain is recovered.
3. **Wayback Machine** — `web.archive.org` can show who was citing the site
   historically, and archived copies of the old site reveal reciprocal links
   worth chasing.
4. **Ask the AHA** — if SHI is a listed chapter/affiliate, the American Humanist
   Association chapter directory is likely to carry the old URL. Their chapter
   directory was not readable from search; contact `field@americanhumanist.org`.

## 5. What to do with each

Two different jobs, and they split along the "who controls it" column:

- **Ours** (Meetup, Facebook ×2, X, YouTube, Square) — just edit them to point
  at `stanislaus-humanists.org`. No one's permission needed. Do these now;
  they're also the ones actively sending people to a site we don't control.
- **Third-party** (United CoR, chistodex, AHA, any directory the checkers turn
  up) — each needs an email asking them to update the URL. Worth doing
  regardless of how the domain fight resolves.

Neither recovers the accumulated search authority; only a 301 redirect from the
old domain does that, and that requires control of the domain.
