# Adding a Custom Domain to the GitHub Pages Site

This site is deployed to GitHub Pages from the repo `klequis/sh-brief` by the
GitHub Actions workflow in [.github/workflows/deploy.yml](../.github/workflows/deploy.yml).
It is currently served at:

    https://klequis.github.io/sh-brief/

This document covers pointing a custom domain (for example
`stanislaushumanists.org`) at that site.

The work splits cleanly into **two independent halves**:

| Half | Where the work happens | Who can do it |
| --- | --- | --- |
| **A. Repo + GitHub settings** | This repo, and GitHub → Settings → Pages | Whoever has admin on `klequis/sh-brief` (you) |
| **B. DNS records** | The domain registrar / DNS host | Whoever controls the domain |

If you control both, do everything (Scenario 1). If someone else controls the
domain, you do Half A and hand them Half B (Scenario 2) — they do **not** need
any access to GitHub, and you do **not** need any access to the registrar.

> **The one code change is already done** (Step 1). The build now uses relative
> asset paths, so it serves correctly at the current `github.io` URL *and* at a
> custom domain root. That means the remaining work is pure configuration — DNS
> records plus two settings in GitHub — and there is no deploy that has to be
> timed against the DNS cutover. You can stop here for weeks and nothing breaks.

---

## Step 0: Decide apex vs. `www`

Pick **one** of these as the primary domain. This choice determines which DNS
records are needed.

| Option | Primary URL | DNS record type | Notes |
| --- | --- | --- | --- |
| **Apex (recommended here)** | `https://stanislaushumanists.org` | `A` + `AAAA` at the root | Shorter URL. Matches the old site. Requires 4 A records (+4 AAAA). |
| **`www` subdomain** | `https://www.stanislaushumanists.org` | one `CNAME` | Simplest DNS. Marginally more resilient if GitHub ever changes IPs. |

Either way you should also set up the *other* one to redirect, so both work.
GitHub does that automatically once both DNS records exist:

- If the primary is the apex, add a `www` CNAME too → GitHub redirects `www` → apex.
- If the primary is `www`, add the apex A/AAAA records too → GitHub redirects apex → `www`.

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
| Custom domain, old config | `stanislaushumanists.org` | `/sh-brief/assets/…` | `/assets/…` ❌ |

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
`stanislaushumanists.org/` after the cutover.

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
stanislaushumanists.org
```

One line, the bare domain, no `https://`, no trailing slash, no `www` (unless
`www` is your primary). It must match the value in GitHub Settings exactly or
the two will fight each other.

---

## Step 2 (Half B — DNS): add the records

These go at the DNS host for the domain (GoDaddy, Namecheap, Cloudflare, Google
Domains/Squarespace, Route 53, etc.). Whoever controls the domain does this.

### Apex records (`stanislaushumanists.org`)

Four `A` records, all with host/name `@` (or blank, or the bare domain —
registrars label this differently):

```
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

And, if the DNS host supports IPv6, four `AAAA` records on the same host `@`:

```
2606:50c0:8000::153
2606:50c0:8001::153
2606:50c0:8002::153
2606:50c0:8003::153
```

> Verify these against GitHub's current published values before handing them
> off: <https://docs.github.com/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site>
> They have been stable for years but GitHub is the authority, not this doc.

### `www` record

One `CNAME` record:

```
Host/Name:  www
Value:      klequis.github.io
```

Note: the value is `klequis.github.io` — the **user's** Pages host, with **no**
`/sh-brief` path and no trailing dot issues (some registrars require a trailing
dot: `klequis.github.io.`).

### Things that break this

- **Do not** leave old `A`, `AAAA`, `ALIAS`, or `CNAME` records for the same
  host pointing at the previous host (Wild Apricot, or anywhere else). Remove
  them. Conflicting records are the most common failure.
- **Cloudflare users:** set the records to **DNS only** (grey cloud), not
  proxied (orange cloud), at least until GitHub has issued the TLS certificate.
  Proxying during setup blocks GitHub's domain validation. You can turn proxying
  back on afterward, with SSL mode set to "Full".
- Do not touch `MX` records if the domain handles email — none of the above
  affects mail.

---

## Step 3 (Half A — GitHub): set the custom domain

1. Go to <https://github.com/klequis/sh-brief/settings/pages>
2. Under **Custom domain**, enter the bare domain (no `https://`):
   `stanislaushumanists.org`
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

1. **DNS first.** Add the A / AAAA / CNAME records (Step 2). Do *not* touch
   GitHub yet. The site keeps working at `klequis.github.io/sh-brief/` the whole
   time.
2. **Wait for propagation.** Verify with the commands in Step 6. Wait until the
   A records resolve to the GitHub IPs from a couple of different networks.
3. **Set the custom domain in GitHub** (Step 3).
4. **Enforce HTTPS** once available (Step 4).
5. **Verify** (Step 6).

Doing DNS before Step 3 means there is no downtime at all — the relative base
path means the already-deployed build serves correctly at the new domain the
moment DNS and the GitHub setting line up.

### Scenario 2 — the domain owner does DNS, you do GitHub

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

> We're moving the website to a new host (GitHub Pages). I don't need any access
> to the domain — I just need these DNS records added at whatever service
> manages DNS for `stanislaushumanists.org`.
>
> **1. Remove** any existing `A`, `AAAA`, or `CNAME` records for the root domain
> (`@`) and for `www` that point at the old website host. Leave `MX` and any
> email-related records (SPF/DKIM/TXT) alone.
>
> **2. Add four A records**, host `@` (or blank / the root domain):
>
>     185.199.108.153
>     185.199.109.153
>     185.199.110.153
>     185.199.111.153
>
> **3. Add four AAAA records**, host `@`, if IPv6 is supported:
>
>     2606:50c0:8000::153
>     2606:50c0:8001::153
>     2606:50c0:8002::153
>     2606:50c0:8003::153
>
> **4. Add one CNAME record**, host `www`, value `klequis.github.io`
>
> If DNS is managed through Cloudflare, please set these to "DNS only" (grey
> cloud), not proxied.
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
# Apex should return the four GitHub IPs
dig +short stanislaushumanists.org A

# www should return klequis.github.io, then the same IPs
dig +short www.stanislaushumanists.org CNAME
dig +short www.stanislaushumanists.org A

# Query a public resolver directly to bypass local caching
dig +short @1.1.1.1 stanislaushumanists.org A
```

Expected apex output:

```
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

For a wider view of propagation across regions: <https://dnschecker.org>

### Check the site (after deploy)

```bash
# Should be 200, and should be served over HTTPS
curl -sI https://stanislaushumanists.org | head -n 1

# www should 301 to the apex
curl -sI https://www.stanislaushumanists.org | head -n 5

# The old URL should 301 to the custom domain
curl -sI https://klequis.github.io/sh-brief/ | head -n 5

# Asset paths should be relative — "./assets/...", no leading slash
curl -s https://stanislaushumanists.org | grep -oE '(src|href)="[^"]*"'
```

That last one is the check for Step 1. Expect `./assets/…` and `./logo.png`. If
you see a leading slash (`/sh-brief/assets/…` or `/assets/…`), the relative-base
build didn't get deployed — check the Actions run.

The same command against `https://klequis.github.io/sh-brief/` should return
identical output, since it's the same build serving at both mount points.

### Manual browser checks

Because the base path and routing are involved, these are worth clicking through
by hand:

- [ ] `https://stanislaushumanists.org` loads with styling and the logo, not a
      blank page
- [ ] Browser console is free of 404s for JS/CSS/images
- [ ] Every header nav link scrolls to its section and updates the URL hash
- [ ] Reloading the page on a hash route (e.g. `/#/about`) lands on that section
- [ ] The site works on a phone (the header nav has mobile-specific behavior)
- [ ] Padlock icon shows in the address bar — no mixed-content warning
- [ ] `www.stanislaushumanists.org` redirects to the apex

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
Certificate issuance is pending or stuck. Wait up to 24h, then remove and
re-add the custom domain to retrigger it. Also confirm Cloudflare proxying is
off if applicable.

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

**Half A — GitHub (you)**

- [x] ~~Set `base: './'` in [app/vite.config.ts](../app/vite.config.ts)~~ — done,
      works at both URLs, nothing to time
- [ ] Optionally add `app/public/CNAME` with the bare domain
- [ ] Set Custom domain in Settings → Pages
- [ ] Enable Enforce HTTPS once available
- [ ] Confirm the Actions deploy succeeded

**Half B — DNS (you or the domain owner)**

- [ ] Remove conflicting old A / AAAA / CNAME records
- [ ] Add 4 apex A records
- [ ] Add 4 apex AAAA records
- [ ] Add `www` CNAME → `klequis.github.io`
- [ ] Cloudflare only: set to DNS-only (grey cloud)
