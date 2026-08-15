# Hosting and the Custom Domain

The site is live at **<https://stanislaus-humanists.org>**, hosted on
**Cloudflare Workers** (static assets) and deployed by **Cloudflare Workers
Builds** on every push to `main`.

This document describes that setup: how a deploy happens, how the domain is
wired, how to verify it, and what to do when something breaks.

> **History.** This site was originally on GitHub Pages, and this document used
> to be a plan for pointing the domain at it. Both halves have since changed —
> hosting moved to Cloudflare Workers, and the GitHub Pages deploy was turned
> off on 2026-08-14. The reasoning that's still load-bearing is preserved below
> under [Why the build works anywhere](#why-the-build-works-anywhere); the rest
> of the old GitHub Pages procedure is gone because it no longer describes
> anything that exists.

## Current state

| | |
| --- | --- |
| **Live URL** | `https://stanislaus-humanists.org` (apex primary) |
| **Also serves** | `https://www.stanislaus-humanists.org` |
| **Domain** | `stanislaus-humanists.org`, registered 2026-08-12 |
| **Registrar / DNS** | Cloudflare (nameservers `hasslo` / `macy.ns.cloudflare.com`) |
| **Host** | Cloudflare Workers — assets-only, no server code |
| **Deploys** | Cloudflare Workers Builds, on push to `main` |
| **Worker name** | `sh-brief` (see [app/wrangler.jsonc](../app/wrangler.jsonc)) |
| **Controlled by** | You. No third party involved. |

Verified 2026-08-14: both the apex and `www` return `200` with `server:
cloudflare`, and the apex resolves to Cloudflare's proxy IPs (`104.21.74.31`,
`172.67.196.30`) rather than to an origin host.

Note that `www` **serves the site directly** — it does not redirect to the apex.
Both hostnames are live and equivalent. If you'd rather have one canonical URL,
that's a redirect rule to add in Cloudflare (see
[Optional: canonicalize on the apex](#optional-canonicalize-on-the-apex)).

## How a deploy works

There is **no deploy workflow in this repo.** Nothing in `.github/workflows/`
publishes the site anymore. The trigger lives on the Cloudflare side:

1. You push to `main` on `klequis/sh-brief`.
2. Cloudflare Workers Builds — connected to the repo through the Cloudflare
   dashboard's GitHub integration — sees the push.
3. It builds from the **`app/` root directory**, runs the install and build
   steps, and produces `app/dist/`.
4. It deploys per [app/wrangler.jsonc](../app/wrangler.jsonc), which points at
   that output:

   ```jsonc
   {
     "name": "sh-brief",
     "compatibility_date": "2026-08-01",
     "assets": {
       "directory": "./dist"   // relative to the app/ root directory
     }
   }
   ```

`assets` with no `main` entry point means this is a **static-assets-only
Worker**: Cloudflare serves the files and runs no server code. There is no
backend, which matches requirement 5 in
[payment-plan-options.md](payment-plan-options.md).

### What lives where

| Setting | Where it's configured | Notes |
| --- | --- | --- |
| Worker name, assets directory | [app/wrangler.jsonc](../app/wrangler.jsonc) | In the repo, travels with the code |
| Watched branch, root directory, build command | Cloudflare dashboard → Workers → `sh-brief` → Settings → Builds | **Not in the repo** |
| Custom domain binding | Cloudflare dashboard → Workers → `sh-brief` → Settings → Domains & Routes | **Not in the repo** |
| DNS records | Cloudflare dashboard → `stanislaus-humanists.org` → DNS | **Not in the repo** |

That middle group is the tradeoff of this setup: three of the four live in a
dashboard tied to a personal Cloudflare account, not in version control. For a
volunteer org whose maintainer may change, **make sure more than one person can
get into that Cloudflare account**, or the deploy pipeline becomes unrecoverable
if access is lost. That risk is the main cost of being here instead of in a
committed workflow file.

### Deploying by hand

Normally unnecessary — pushing to `main` is the path. But from `app/`:

```bash
pnpm build
pnpm dlx wrangler deploy
```

This requires being logged in as the account that owns the Worker
(`pnpm dlx wrangler login`). There is no `deploy` script in
[app/package.json](../app/package.json); add one if you find yourself doing this
often.

## DNS

The domain is registered with Cloudflare Registrar, so its DNS is at Cloudflare
and can't move without transferring the domain. With the site *also* on
Cloudflare, this is the simple case — attaching a custom domain to a Worker
creates and manages the DNS record for you.

Current resolution:

```
NS       hasslo.ns.cloudflare.com.   macy.ns.cloudflare.com.
apex A   104.21.74.31   172.67.196.30      (Cloudflare proxy IPs)
www  A   104.21.74.31   172.67.196.30      (same)
```

Both hostnames are **proxied** (orange cloud). That's correct and expected here
— unlike the old GitHub Pages setup, where proxying broke certificate issuance,
a Worker *is* the Cloudflare edge. There is no origin behind it to misconfigure,
so the Flexible-SSL redirect loop that plagues proxied third-party origins
cannot happen. HTTPS and certificates are handled automatically.

### Optional: canonicalize on the apex

Serving identical content at two hostnames splits search-engine signals. If you
want `www` to redirect instead:

Cloudflare dashboard → `stanislaus-humanists.org` → **Rules** → **Redirect
Rules** → create a rule:

- **If** hostname equals `www.stanislaus-humanists.org`
- **Then** static redirect to `https://stanislaus-humanists.org` with
  **301 Permanent**, preserving path and query string

Low priority for a site this size, but it's the tidy thing to do.

### Don't touch

Leave `MX` and any `TXT` records (SPF/DKIM) alone — nothing above affects email.
The domain likely has none yet, but this matters if mail is ever set up on it.

## Why the build works anywhere

[app/vite.config.ts](../app/vite.config.ts) sets a **relative** base:

```ts
base: './',
```

This was originally done so one build could serve correctly both at a GitHub
Pages project URL (`…/sh-brief/`, a subpath) and at a custom domain root. The
subpath case is gone, but **leave this setting alone** — it is equally correct
at a domain root, and it keeps `pnpm serve` and any future preview URL working
regardless of what path they're mounted at.

It is safe here specifically because the app uses **`HashRouter`**
([App.tsx:9](../app/src/App.tsx#L9)). Hash routing only ever changes the
fragment after `#`, never the document path, so `./` resolves against the same
base on every route. **If anyone switches to `BrowserRouter`**, deep paths like
`/about/team` would change what `./` means and every asset would 404 — at which
point `base` must become `'/'`, and the Worker needs SPA fallback routing
configured so those paths return `index.html` instead of a 404.

Everything in the app derives its paths from `base`; nothing hardcodes a path
prefix. Both places that could have been missed were checked:

- [Header.tsx:86](../app/src/components/layout/Header.tsx#L86) builds its logo
  path at runtime from `import.meta.env.BASE_URL`, which compiles to
  `"./logo.png"`.
- The icons in [index.html:14-16](../app/index.html#L14-L16) are written
  root-absolute in source (`/favicon.ico`, `/favicon.svg`,
  `/apple-touch-icon.png`) but Vite rewrites them at build time, so they follow
  `base` automatically.

Confirmed against the live deploy — every path in the served HTML is relative:

```
href="./favicon.ico"   href="./favicon.svg"   href="./apple-touch-icon.png"
src="./assets/index-CMylOT7Q.js"             href="./assets/index-B3EdzwCv.css"
```

No `CNAME` file exists in `app/public/`, and none is needed — that was a GitHub
Pages mechanism. Don't add one; on Cloudflare it would just be a stray file
served at `/CNAME`.

## Verification

### After a deploy

```bash
# Apex should be 200, served by Cloudflare
curl -sI https://stanislaus-humanists.org | head -n 1

# Confirm it's the Worker and not a stale cache
curl -sI https://stanislaus-humanists.org | grep -iE 'server|cf-cache-status'

# www should also answer (200 today; 301 if you add the redirect rule)
curl -sI https://www.stanislaus-humanists.org | head -n 1

# Asset paths should be relative — "./assets/...", no leading slash
curl -s https://stanislaus-humanists.org | grep -oE '(src|href)="[^"]*"'
```

Expect `./assets/…` and `./logo.png` from that last one. A leading slash means
an unexpected build is live.

To confirm a *specific* push went out, compare the deployed HTML against your
local build, or check the build log in the Cloudflare dashboard → Workers →
`sh-brief` → **Deployments**. `cf-cache-status: HIT` on a fresh deploy is normal
for repeat requests; add `-H 'Cache-Control: no-cache'` to bypass.

### DNS

```bash
dig +short stanislaus-humanists.org NS
dig +short stanislaus-humanists.org A
dig +short www.stanislaus-humanists.org A

# Bypass local caching
dig +short @1.1.1.1 stanislaus-humanists.org A
```

Apex returning `104.x.x.x` / `172.67.x.x` is **correct** on this setup — those
are Cloudflare's proxy IPs. (Under the old GitHub Pages setup that same result
was a failure signature, which is worth knowing if you find old notes.)

For propagation across regions: <https://dnschecker.org>

### Manual browser checks

Worth clicking through by hand after any change to routing or the base path:

- [ ] `https://stanislaus-humanists.org` loads with styling and the logo, not a
      blank page
- [ ] Browser console is free of 404s for JS/CSS/images
- [ ] Every header nav link scrolls to its section and updates the URL hash
- [ ] Reloading on a hash route (e.g. `/#/about`) lands on that section
- [ ] The site works on a phone (the header nav has mobile-specific behavior)
- [ ] Padlock icon shows — no mixed-content warning
- [ ] `www.stanislaus-humanists.org` loads (or redirects, if the rule is added)

## The old GitHub Pages deploy

Turned **off** on 2026-08-14. The workflow file
[.github/workflows/deploy.yml](../.github/workflows/deploy.yml) still exists but
is disabled at GitHub, so pushes to `main` no longer trigger it:

```bash
gh workflow list --all
# Deploy to GitHub Pages    disabled_manually    328976680
```

To re-enable it: `gh workflow enable "Deploy to GitHub Pages"`. To remove it
permanently, delete the file and push.

**The stale copy may still be public.** GitHub Pages keeps serving the last
build it made at <https://klequis.github.io/sh-brief/> even with the workflow
disabled. That's a frozen duplicate of the site that search engines can index in
competition with the real domain. To take it down:

```bash
gh api -X DELETE repos/klequis/sh-brief/pages
```

Check whether it's still up with
`curl -sI https://klequis.github.io/sh-brief/ | head -n 1`.

## Troubleshooting

**A push to `main` didn't deploy**
First confirm the push actually landed: `git status -sb` should show no unpushed
commits. Then check Cloudflare dashboard → Workers → `sh-brief` → **Deployments**
for a failed or missing build. Because the trigger is dashboard-side, a broken
GitHub connection (revoked app authorization, changed repo permissions) shows up
as *silence* — no failed build, just nothing — so the absence of a build entry is
itself the diagnostic. Reconnect under Settings → Builds.

**Build fails on Cloudflare but works locally**
The build runs from the `app/` root directory with a frozen lockfile. Verify
`app/pnpm-lock.yaml` is committed and current — `pnpm install --frozen-lockfile`
in `app/` should succeed with no changes.

**Blank white page, console shows 404s for JS/CSS**
Check asset paths in the served HTML (Verification, above). They should start
with `./`. If someone switched `HashRouter` to `BrowserRouter`, the relative base
is no longer safe — see [Why the build works anywhere](#why-the-build-works-anywhere).

**Old content still served after a successful deploy**
Cloudflare's cache. Retry with `-H 'Cache-Control: no-cache'`, or purge the
cache in the dashboard → Caching → Configuration → Purge Everything.

**Domain stops resolving**
Confirm the nameservers are still `hasslo` / `macy.ns.cloudflare.com` and the
domain hasn't expired. Registered 2026-08-12; check the renewal date in
Cloudflare Registrar.

## Rolling back

Cloudflare keeps previous deployments. Dashboard → Workers → `sh-brief` →
**Deployments** → select a known-good one → **Rollback**. Or revert the offending
commit and push, which triggers a normal forward deploy — usually the better
option, since it keeps the repo and the live site in agreement.

## Note on the *other* domain

The org's existing domain `stanislaushumanists.org` (no hyphen) is a separate
thing, untouched by any of the above. As of 2026-08-12:

- Its nameservers are `sofia` / `santino.ns.cloudflare.com`, so its DNS is
  managed through Cloudflare by someone.
- It still resolves to `34.226.77.200` — the Wild Apricot host.

**Who administers it is an open question**, and
[site-setup-plan.md](site-setup-plan.md) lists exactly that as an unresolved
decision. DNS can't answer it: Cloudflare assigns nameserver pairs per zone, and
two domains in the same account often get different pairs, so the differing pair
tells you nothing about whose account it is. Finding out means asking the board.

If the org turns out to control it and wants to use it instead, the work is
small: add it as a second custom domain on the `sh-brief` Worker. If it's in a
*different* Cloudflare account, it must first be moved into this one, or its DNS
pointed here — which needs cooperation from whoever holds it.
