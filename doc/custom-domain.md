# Adding a Custom Domain to the GitHub Pages Site

This site is deployed to GitHub Pages from the repo `klequis/sh-brief` by the
GitHub Actions workflow in [.github/workflows/deploy.yml](../.github/workflows/deploy.yml).
It is currently served at:

    https://klequis.github.io/sh-brief/

This document covers pointing the custom domain **`stanislaus-humanists.org`** at
that site.

## Current state

| | |
| --- | --- |
| **Domain** | `stanislaus-humanists.org`, registered 2026-08-12 |
| **Registrar / DNS** | Cloudflare (nameservers `hasslo` / `macy.ns.cloudflare.com`) |
| **Host** | GitHub Pages — staying there, see below |
| **Controlled by** | You, both halves. No third party involved. |

Because Cloudflare Registrar requires its own nameservers, DNS for this domain
is at Cloudflare and can't be moved elsewhere without transferring the domain.
That's fine — Cloudflare's DNS is a good place to be, and it makes the apex
setup *simpler* than a typical registrar (see Step 2).

### Why not host on Cloudflare Pages too?

The domain being at Cloudflare is not a reason to move hosting there. The main
draw of Cloudflare Pages is Workers/Functions for serverless backend code, and
[payment-plan-options.md](payment-plan-options.md) already rules that need out —
requirement 5 is "static site, no backend," and the surviving payment options
(Stripe, Square, PayPal) all work as a hosted-checkout link from a static page.

Staying on GitHub Pages also keeps the deploy config in
[deploy.yml](../.github/workflows/deploy.yml), where it travels with the repo,
rather than in a dashboard tied to one personal account — which matters for a
volunteer org whose maintainer may change. Revisit only if a genuine backend
need appears; migrating a static site between the two is a short job with no
lock-in penalty for waiting.

### Note on the *other* domain

The org's existing domain `stanislaushumanists.org` (no hyphen) is a separate
thing. What DNS shows, as of 2026-08-12:

- Its nameservers are `sofia` / `santino.ns.cloudflare.com`, so its DNS is
  managed through Cloudflare by someone.
- It still resolves to `34.226.77.200` — the Wild Apricot host.

**Who administers it is an open question**, and
[site-setup-plan.md](site-setup-plan.md) lists exactly that as an unresolved
decision. DNS can't answer it: Cloudflare assigns nameserver pairs per zone, and
two domains in the same account often get different pairs, so the fact that this
pair differs from `hasslo` / `macy` tells you nothing about whose account it is.
Finding out means asking the board, not querying DNS.

Nothing in this document touches that domain. If the org turns out to control it
— or gains control later — and wants to use it instead, the steps here apply
unchanged. Only the domain name differs, and Step 5's handoff section covers the
case where someone else holds the DNS.

## The two halves

| Half | Where the work happens | Who can do it |
| --- | --- | --- |
| **A. Repo + GitHub settings** | This repo, and GitHub → Settings → Pages | Whoever has admin on `klequis/sh-brief` (you) |
| **B. DNS records** | Cloudflare dashboard | Whoever controls the domain (you) |

You control both, so follow Scenario 1 in Step 5. Scenario 2 is retained only
for the `stanislaushumanists.org` case above, where someone else would hold DNS.

> **The one code change is already done** (Step 1). The build now uses relative
> asset paths, so it serves correctly at the current `github.io` URL *and* at a
> custom domain root. That means the remaining work is pure configuration — DNS
> records plus two settings in GitHub — and there is no deploy that has to be
> timed against the DNS cutover. You can stop here for weeks and nothing breaks.

---

## Step 0: Decide apex vs. `www`

Pick **one** of these as the primary domain. This choice determines which DNS
records are needed.

| Option | Primary URL | Notes |
| --- | --- | --- |
| **Apex (recommended)** | `https://stanislaus-humanists.org` | Shorter, cleaner for print and word of mouth. |
| **`www` subdomain** | `https://www.stanislaus-humanists.org` | No real advantage here. |

On a typical registrar the apex is the awkward choice, because apex records
can't be `CNAME`s and you're stuck hardcoding GitHub's four IP addresses.
**Cloudflare removes that tradeoff** via CNAME flattening: you enter a `CNAME`
at the root and Cloudflare serves it as `A` records automatically. So the apex
costs you nothing extra and needs no hardcoded IPs.

Either way, set up the other one too so both work. GitHub redirects between
them automatically once both records exist:

- Primary apex → add a `www` record too → GitHub redirects `www` → apex.
- Primary `www` → add the apex record too → GitHub redirects apex → `www`.

The rest of this doc assumes **apex primary with `www` also configured**. If you
choose `www` primary, the only difference is which name you type into the
GitHub "Custom domain" box in Step 3.

---

## Step 1 (Half A — repo): the Vite base path — ALREADY DONE

**Status: complete.** This change is already committed; it's documented here so
the reasoning isn't lost. No action needed unless something in this section
looks wrong.

### Why a change was needed

A GitHub Pages *project* site (any repo that isn't `username.github.io`) serves
at `https://username.github.io/<repo>/`. But once a custom domain is attached,
it serves from the **root** of that domain — the `/sh-brief/` path segment
disappears.

The config used to say:

```ts
// Served from https://klequis.github.io/sh-brief/
base: '/sh-brief/',
```

That made Vite emit **root-absolute** asset paths — `/sh-brief/assets/index.js`,
with a leading slash. Those resolve against the domain root, wherever that is:

| | Domain root | HTML asks for | Files actually at |
| --- | --- | --- | --- |
| `github.io`, old config | `klequis.github.io` | `/sh-brief/assets/…` | `/sh-brief/assets/…` ✅ |
| Custom domain, old config | `stanislaus-humanists.org` | `/sh-brief/assets/…` | `/assets/…` ❌ |

That second row is a blank white page with 404s for every JS and CSS file. The
site was fine before the migration; it would have broken at the cutover.

### What was done instead

Rather than swapping to `base: '/'` (correct only *after* the move, breaking the
`github.io` URL the moment it deploys), the config now uses a **relative** base:

```ts
base: './',
```

Relative paths resolve against the page's own location, so one build works at
**both** URLs at once — `klequis.github.io/sh-brief/` today and
`stanislaus-humanists.org/` after the cutover.

This is safe here specifically because the app uses `HashRouter`: hash routing
only ever changes the fragment after `#`, never the document path, so `./` keeps
resolving against the same base on every route. (With a `BrowserRouter`, deep
paths like `/about/team` would shift what `./` means, and this trick would not
work.)

**The practical payoff:** the code change is fully decoupled from the DNS
cutover. There is no window where either URL is broken, and no deploy that has
to land at a precise moment. Step 5's ordering is now about GitHub settings
only.

### Verified at build time

```
dist/index.html:  href="./assets/index-BA7vnOmu.css"
                  src="./assets/index-kG_jYbod.js"
                  href="./logo.png"
built CSS:        url(./ubuntu-400-CQJ26Fy6.woff2)   (+3 more fonts)
```

No `/sh-brief/` string remains anywhere in `dist/`. Fonts referenced from inside
the CSS resolve relative to the stylesheet in `dist/assets/`, which is correct.

Two things that could have been missed and were checked:

- [Header.tsx:40](../app/src/components/layout/Header.tsx#L40) builds its logo
  path at runtime from `import.meta.env.BASE_URL`. That now compiles to
  `"./logo.png"`, resolved against the document URL — correct at both mount
  points.
- The favicon in [index.html:11](../app/index.html#L11) is written as
  `/logo.png` in source but rewritten by Vite at build time, so it follows
  `base` automatically.

Everything in the app derives its paths from `base`. Nothing hardcodes
`/sh-brief/`. That's why this was a one-line change.

### Optional: commit a `CNAME` file

Because this repo deploys via a GitHub Actions workflow (not the legacy
`gh-pages` branch), the custom domain is stored in **repo settings** and a
`CNAME` file is not strictly required.

Adding one anyway is harmless and protects the setting from being lost. If you
want it, create `app/public/CNAME` — files in `app/public/` are copied verbatim
into `app/dist/`, which is what the workflow uploads:

```
stanislaus-humanists.org
```

One line, the bare domain, no `https://`, no trailing slash, no `www` (unless
`www` is your primary). It must match the value in GitHub Settings exactly or
the two will fight each other.

---

## Step 2 (Half B — DNS): add the records in Cloudflare

Go to the Cloudflare dashboard → select `stanislaus-humanists.org` → **DNS** →
**Records**.

The domain is brand new, so there should be nothing to clean up. If Cloudflare
added any placeholder or parking records at the apex or `www`, delete them
first — conflicting records are the most common cause of failure here.

### Add two records

| Type | Name | Target | Proxy status | TTL |
| --- | --- | --- | --- | --- |
| `CNAME` | `@` | `klequis.github.io` | **DNS only** (grey cloud) | Auto |
| `CNAME` | `www` | `klequis.github.io` | **DNS only** (grey cloud) | Auto |

That's it — two records, no IP addresses. Cloudflare's **CNAME flattening**
turns the apex `CNAME` into `A` records at query time, which is why the root
domain doesn't need GitHub's four IPs. It also means you're immune to GitHub
ever changing them.

Notes on the target value:

- It is `klequis.github.io` — the **account** Pages host. No `/sh-brief` path,
  no `https://`, no repo name. The repo is identified by the GitHub setting in
  Step 3, not by DNS.
- Cloudflare will show "CNAME flattening" or resolve the apex automatically; you
  don't need to enable anything.

### Proxy status matters — start with DNS only

The grey-cloud / orange-cloud toggle is the single most common Cloudflare
mistake here.

- **Set both records to "DNS only" (grey cloud) initially.** Proxying blocks
  GitHub's domain validation, so the Let's Encrypt certificate in Step 4 will
  never issue.
- You *may* turn proxying on later, once HTTPS is working and enforced, if you
  want Cloudflare's caching and analytics in front of GitHub Pages. If you do:
  set **SSL/TLS → Overview → Full** (or Full (strict)). Leaving it on
  **Flexible** causes an infinite redirect loop, because GitHub redirects to
  HTTPS while Cloudflare keeps requesting HTTP.
- There is no obligation to proxy. Grey cloud is a perfectly good permanent
  state for this site.

### If you ever need the raw IPs

Not needed with CNAME flattening, but for reference — GitHub's apex `A` records
are `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`,
with `AAAA` at `2606:50c0:800{0,1,2,3}::153`. Verify against GitHub's current
published values rather than trusting this doc:
<https://docs.github.com/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site>

### Don't touch

Leave `MX` and any `TXT` records (SPF/DKIM) alone — none of the above affects
email. The new domain probably has none yet, but this matters if mail is ever
set up on it.

---

## Step 3 (Half A — GitHub): set the custom domain

1. Go to <https://github.com/klequis/sh-brief/settings/pages>
2. Under **Custom domain**, enter the bare domain (no `https://`):
   `stanislaus-humanists.org`
3. Click **Save**.

GitHub immediately runs a DNS check. If DNS has already propagated you'll see a
green check. If not, you'll see a warning like "Domain's DNS record could not be
retrieved" — that is expected and it will clear on its own once DNS propagates
(minutes to a few hours, occasionally up to 48h if the old records had a long
TTL).

**Important side effect:** as soon as this is saved, GitHub redirects
`https://klequis.github.io/sh-brief/` to the custom domain. So during the gap
between saving here and DNS being live, the site is unreachable at *both* URLs.
Plan for that (Step 5).

---

## Step 4 (Half A — GitHub): enforce HTTPS

Once the DNS check passes, GitHub automatically requests a Let's Encrypt
certificate. This usually takes a few minutes but can take up to ~24 hours.

When the **Enforce HTTPS** checkbox on the Pages settings page becomes
selectable, **check it**. Until then it will be greyed out with "Unavailable for
your site because the certificate has not finished being issued."

If it stays greyed out for more than a day: remove the custom domain, save, wait
a minute, re-enter it, and save again. That re-triggers certificate issuance and
resolves most stuck cases.

---

## Step 5: Ordering — who does what, when

### Scenario 1 — you do everything

Best order, minimizing downtime:

Step 1 is already done and is deploy-safe at both URLs, so there is no code
change to time. What's left:

1. **DNS first.** Add the two Cloudflare `CNAME` records (Step 2), both set to
   DNS only. Do *not* touch GitHub yet — the site keeps working at
   `klequis.github.io/sh-brief/` the whole time.
2. **Wait for propagation.** Verify with the commands in Step 6. Cloudflare
   publishes changes in seconds, but the domain itself was only registered on
   2026-08-12, so give the initial nameserver delegation time to spread — a new
   registration can take a few hours to be visible everywhere.
3. **Set the custom domain in GitHub** (Step 3).
4. **Enforce HTTPS** once available (Step 4).
5. **Verify** (Step 6).

Doing DNS before Step 3 means there is no downtime at all — the relative base
path means the already-deployed build serves correctly at the new domain the
moment DNS and the GitHub setting line up.

### Scenario 2 — someone else does DNS, you do GitHub

**Not applicable to `stanislaus-humanists.org`** — you hold that domain, so use
Scenario 1. This section is kept for the case where the site moves to
`stanislaushumanists.org` (no hyphen) and its Cloudflare account turns out to be
administered by someone else.

The dependency is one-directional: **their DNS work must land before your
GitHub work**, otherwise you take the site down while waiting on them.

1. Send them the handoff below. Ask them to confirm when the records are saved.
2. Verify their work yourself with the `dig` commands in Step 6 — do not rely on
   "I did it," verify the records actually resolve. This is the checkpoint.
3. Once verified, do Steps 3 and 4.

Because Step 1 is already deployed and works at both URLs, waiting on the domain
owner costs nothing — the current site stays up and healthy indefinitely.

If they add the records but something is wrong, you'll see it in Step 6 and can
tell them exactly which record is off, without ever needing registrar access.

#### Handoff text for the domain owner

Substitute the correct domain name before sending.

> We're moving the website to a new host (GitHub Pages). I don't need any access
> to the domain — I just need these DNS records added at whatever service
> manages its DNS.
>
> **1. Remove** any existing `A`, `AAAA`, or `CNAME` records for the root domain
> (`@`) and for `www` that point at the old website host (Wild Apricot). Leave
> `MX` and any email-related records (SPF/DKIM/TXT) alone.
>
> **2a. If DNS is on Cloudflare** — add just two records, both set to **"DNS
> only"** (grey cloud, not proxied):
>
>     CNAME   @     klequis.github.io
>     CNAME   www   klequis.github.io
>
> **2b. On any other DNS host**, the root domain can't take a CNAME, so it needs
> the IPs instead. Four `A` records on host `@`:
>
>     185.199.108.153
>     185.199.109.153
>     185.199.110.153
>     185.199.111.153
>
> Four `AAAA` records on host `@`, if IPv6 is supported:
>
>     2606:50c0:8000::153
>     2606:50c0:8001::153
>     2606:50c0:8002::153
>     2606:50c0:8003::153
>
> Plus one `CNAME` on host `www` with value `klequis.github.io`.
>
> Let me know when they're saved and I'll take it from there. There may be a
> short period where the site is unreachable while things propagate.

#### If they also want to do the GitHub side

They'd need to be added as an admin on `klequis/sh-brief`, which is probably not
what you want. There's no need — Half A and Half B are fully separable.

---

## Step 6: Verification

### Check DNS (before touching GitHub)

```bash
# Nameservers — confirm delegation has propagated at all
dig +short stanislaus-humanists.org NS

# Apex: CNAME flattening means this returns GitHub's IPs, not a CNAME
dig +short stanislaus-humanists.org A

# www keeps its CNAME, which then resolves to the same IPs
dig +short www.stanislaus-humanists.org CNAME
dig +short www.stanislaus-humanists.org A

# Query a public resolver directly to bypass local caching
dig +short @1.1.1.1 stanislaus-humanists.org A
```

Expected:

```
NS      hasslo.ns.cloudflare.com.   macy.ns.cloudflare.com.
apex A  185.199.108.153  185.199.109.153  185.199.110.153  185.199.111.153
www     klequis.github.io.  →  same four IPs
```

Two failure signatures worth recognizing:

- **Empty output everywhere** — nameserver delegation hasn't propagated yet.
  Expected for a domain registered on 2026-08-12; wait it out.
- **Apex returns `104.x.x.x` or `172.67.x.x`** — those are *Cloudflare's* IPs,
  meaning the record is proxied (orange cloud). GitHub's certificate will never
  issue. Switch the record to DNS only.

For a wider view of propagation across regions: <https://dnschecker.org>

### Check the site (after deploy)

```bash
# Should be 200, and should be served over HTTPS
curl -sI https://stanislaus-humanists.org | head -n 1

# www should 301 to the apex
curl -sI https://www.stanislaus-humanists.org | head -n 5

# The old URL should 301 to the custom domain
curl -sI https://klequis.github.io/sh-brief/ | head -n 5

# Asset paths should be relative — "./assets/...", no leading slash
curl -s https://stanislaus-humanists.org | grep -oE '(src|href)="[^"]*"'
```

That last one is the check for Step 1. Expect `./assets/…` and `./logo.png`. If
you see a leading slash (`/sh-brief/assets/…` or `/assets/…`), the relative-base
build didn't get deployed — check the Actions run.

The same command against `https://klequis.github.io/sh-brief/` should return
identical output, since it's the same build serving at both mount points.

### Manual browser checks

Because the base path and routing are involved, these are worth clicking through
by hand:

- [ ] `https://stanislaus-humanists.org` loads with styling and the logo, not a
      blank page
- [ ] Browser console is free of 404s for JS/CSS/images
- [ ] Every header nav link scrolls to its section and updates the URL hash
- [ ] Reloading the page on a hash route (e.g. `/#/about`) lands on that section
- [ ] The site works on a phone (the header nav has mobile-specific behavior)
- [ ] Padlock icon shows in the address bar — no mixed-content warning
- [ ] `www.stanislaus-humanists.org` redirects to the apex

---

## Troubleshooting

**Blank white page, console shows 404s for the JS/CSS files**
Check the asset paths in the served HTML (Step 6). They should start with `./`.
If they start with `/`, an older build is live — check
<https://github.com/klequis/sh-brief/actions>. If someone has since switched the
router from `HashRouter` to `BrowserRouter`, the relative base is no longer safe;
see Step 1.

**"Domain's DNS record could not be retrieved" in GitHub Settings**
DNS hasn't propagated yet, or the records are wrong. Run the `dig` commands. If
they return the right IPs but GitHub still complains, click Save on the Pages
settings again to force a recheck.

**"Enforce HTTPS" stays greyed out**
Almost always Cloudflare proxying. Check the DNS records are grey-cloud "DNS
only", not orange. Otherwise certificate issuance is just pending — wait up to
24h, then remove and re-add the custom domain to retrigger it.

**Infinite redirect loop / `ERR_TOO_MANY_REDIRECTS`**
Cloudflare proxying is on with SSL/TLS mode set to **Flexible**. Cloudflare
requests HTTP from GitHub, GitHub redirects to HTTPS, repeat. Fix by setting
SSL/TLS → Overview to **Full**, or by switching the records back to DNS only.

**Site shows a 404 branded "There isn't a GitHub Pages site here"**
The custom domain in Settings doesn't match the domain being requested, or a
`CNAME` file in the build disagrees with the Settings value. Make them identical.

**Both the custom domain and the github.io URL are down**
The domain was set in GitHub Settings before DNS was ready. Either wait for DNS,
or clear the Custom domain field in Settings to restore the github.io URL.

**Certificate error / "Your connection is not private"**
Either HTTPS enforcement was enabled before the certificate finished issuing, or
you're hitting a cached redirect. Try an incognito window; the certificate
usually resolves itself within an hour.

---

## Rolling back

If it needs to be undone:

1. Clear the **Custom domain** field in
   <https://github.com/klequis/sh-brief/settings/pages> and save.
2. Delete `app/public/CNAME` if one was added.
3. The site returns to `https://klequis.github.io/sh-brief/`.

**Leave `base: './'` alone.** It is correct for the `github.io` URL too, so
there is nothing to revert in the code — that's the whole point of the relative
path. DNS records can be left in place harmlessly, or removed at leisure.

---

## Summary checklist

**Half B — DNS (Cloudflare) — do this first**

- [ ] Delete any placeholder records Cloudflare created at `@` or `www`
- [ ] Add `CNAME` `@` → `klequis.github.io`, **DNS only** (grey cloud)
- [ ] Add `CNAME` `www` → `klequis.github.io`, **DNS only** (grey cloud)
- [ ] Confirm with `dig` that the apex returns GitHub's IPs, not Cloudflare's

**Half A — GitHub**

- [x] ~~Set `base: './'` in [app/vite.config.ts](../app/vite.config.ts)~~ — done,
      works at both URLs, nothing to time
- [ ] Optionally add `app/public/CNAME` containing `stanislaus-humanists.org`
- [ ] Set Custom domain to `stanislaus-humanists.org` in Settings → Pages
- [ ] Enable Enforce HTTPS once available
- [ ] Confirm the Actions deploy succeeded

**Not doing**

- Moving hosting to Cloudflare Pages — no backend need, and the deploy config is
  better off living in the repo. Revisit only if that changes.
