# Payment / Membership Signup — Options Analysis

**Org:** Stanislaus Humanists (SH) — **501(c)(3)** non-profit
**Need:** Membership signup + dues collection, linked from this site
**Context:** SH currently uses **WildApricot**; this project is an effort to migrate away from it
**Date researched:** 2026-08-07

---

## 1. Requirements

Stated by SH:

1. **No CMS / no CRM needed.** This project *is* the website. The payment system must not
   try to be a website builder or take over content management.
2. **Link out to a payment system.** A button on the Membership section pointing at a
   hosted checkout page. No embedded complexity required.
3. **White-label preferred.** The checkout should read as Stanislaus Humanists, not as a
   third-party fundraising brand.
4. **Migrating off WildApricot.** Cost reduction and escaping an all-in-one platform are
   both drivers.

Derived from the codebase ([01.start.md](01.start.md)):

5. **Static site, no backend.** SolidJS on GitHub Pages — no server, no database, no
   place to hold a secret API key. Hosted checkout pages and publishable-key integrations
   are fine; anything needing a server-side secret is not.

These requirements are more restrictive than they first appear, and requirement 3
eliminates most of the "nonprofit-focused" category outright. See §2.

---

## 2. Why "white-label" rules out most nonprofit platforms

The zero-fee nonprofit platforms — **Zeffy** and **Givebutter** — are free precisely
*because* they are not white-label. Their business model is a **tip prompt shown to your
member at checkout**, asking the member to add a contribution to the platform on top of
their dues. Reported Zeffy defaults are ~17% on payments under ~$99.50 and ~15% above.

That prompt is not a removable skin. It **is** the product:

- The member sees a third-party company's name and a suggested up-charge mid-checkout.
- Turning it off is either impossible (Zeffy) or expensive (Givebutter: disabling tips
  triggers a flat 3% platform fee plus 2.9% + 30¢ processing, ~5.9% all-in).
- For a small local chapter where members know the board personally, a surprise ~$5 line
  item on $30 dues is a member-relations problem, not just a UX quirk.

**Conclusion:** Zeffy and Givebutter are excellent options for an org optimizing purely
for cost, and they were the recommendation before the white-label requirement was stated.
Under requirement 3 they are **not viable**. They are retained in §5 for completeness and
in case the board decides cost outweighs branding.

Similarly, requirement 1 removes the all-in-one platforms — **WildApricot** (the thing
being escaped), **MembershipWorks**, **Join It**, **Neon One**, **Bloomerang** — since
they exist to be your member CMS. Paying for member-management features while
simultaneously building a custom site to replace them is paying twice.

**What survives all five requirements: Stripe, Square, and PayPal.**

---

## 3. The gap nobody flags until after migration

WildApricot was doing a job beyond taking payments: **it knew who was a current member
and when they lapsed.** If SH drops the CMS, that job doesn't disappear — it moves.

This is the single most important thing to decide before picking a vendor, because it's
the reason orgs migrate off WildApricot and then quietly migrate back.

The good news: **Stripe's Customers + Subscriptions views cover this adequately** for a
chapter-sized org, without any CMS:

| WildApricot did | Stripe equivalent | Adequate? |
|---|---|---|
| Member roster | Customers list, exportable to CSV | ✅ Yes |
| Membership levels | Products / Prices (one per tier) | ✅ Yes |
| Renewal date tracking | Subscription renewal dates | ✅ Yes |
| Auto-renewal billing | Stripe Billing subscriptions | ✅ Yes |
| Dunning / failed payment retry | Smart Retries + reminder emails | ✅ Yes |
| Payment receipts | Automatic email receipts | ✅ Yes |
| Custom member fields | Payment Link custom fields | ⚠️ Basic |
| Member directory | — | ❌ None |
| Member-only content gating | — | ❌ None |
| Mass email to members | — | ❌ Export to Mailchimp |
| Event registration | Separate Payment Links per event | ⚠️ Workable |

**Ask the board:** does SH actually use the directory, content gating, or event
registration in WildApricot today? If yes, those needs must land somewhere before
cancelling. If no — which is common for chapters this size — Stripe alone is sufficient
and the migration is clean.

---

## 4. The three viable options

### 4.1 Stripe Payment Links — recommended

**Cost:** $0/month. **Fees:** 2.9% + 30¢ domestic cards; ACH 0.8% capped at $5.
**Optional add-on:** custom domain, $10/month — see §7, where I recommend skipping it.

**White-label assessment — the best available, with one caveat:**
- **Branding (free):** custom logo, background color, and button color; 20 preset fonts;
  3 border radius options. This does most of the white-labeling work at no cost.
- **Custom domain ($10/mo, optional):** checkout URLs become
  `checkout.stanislaushumanists.org/...` instead of a Stripe URL, via a CNAME record;
  applies to all Stripe-hosted surfaces at once. Not domain registration — SH already
  owns the domain. At $120/yr against ~$1,800 of dues this is poor value; see §7.
- **Caveat, stated plainly:** Stripe does not offer removal of its "powered by Stripe"
  attribution on hosted pages. With a custom domain and your logo the page reads as SH's,
  but it is *not* 100% unbranded. **If the board's requirement is literally zero
  third-party mark, no hosted option satisfies that** — that would require a
  self-hosted form with Stripe Elements, which needs a backend and contradicts
  requirement 5.

**Fit against the requirements:**

| Req | Status |
|---|---|
| 1. No CMS | ✅ Pure payment processor |
| 2. Link out | ✅ Payment Link is literally a URL |
| 3. White-label | ⚠️ Best available; custom domain + logo, minor Stripe attribution |
| 4. Off WildApricot | ✅ Replaces the payment + roster function (§3) |
| 5. Static site | ✅ No code at all, or an optional buy-button embed |

**Pros**
- **No tip prompt.** The member sees the dues amount and nothing else — the decisive
  advantage over Zeffy/Givebutter for a white-label brief.
- Created entirely in the Stripe Dashboard, no code. A link per membership tier.
- **Recurring subscriptions** for auto-renewing annual dues, with automatic renewal
  reminders and Smart Retries on failed cards — replacing WildApricot's dunning.
- **Custom fields** collect member details (address, phone, interests, newsletter opt-in)
  at checkout, so signup and payment are one step.
- Automatic email receipts; no-code refunds.
- Funds settle directly to SH's bank; no intermediary holds the money.
- Also supports promotion codes (useful for student/hardship rates), QR codes for
  in-person signup at meetings, and 40+ payment methods including Apple/Google Pay.
- CSV export of customers means **no lock-in** — you won't repeat this migration.

**Cons**
- Attribution caveat above.
- No member directory or content gating (see §3) — confirm these aren't needed.
- The **30¢ fixed fee stings on small amounts**: on $30 dues it's 1% by itself, making
  the effective rate ~3.9%.
- Nonprofit discount likely unavailable — see §6.
- Custom domain is a real $120/yr if you want the branded URL; weigh against the
  white-label priority.

---

### 4.2 Square — viable, best if in-person dues matter

**Cost:** $0/month. **Fees:** 2.9% + 30¢ online; 2.6% + 10¢ tap/chip in person.

**Pros**
- Free hosted checkout links, same link-out model as Stripe.
- **Best-in-class in-person hardware.** If SH collects dues or donations at monthly
  meetings — likely for a chapter — the 2.6% + 10¢ in-person rate beats everything here,
  and it's the same account and the same reporting as the online payments.
- No tip prompt on the nonprofit-relevant flows; clean checkout.
- Same-day deposit available.

**Cons**
- **Weaker white-label controls than Stripe** — no custom-domain equivalent for checkout,
  so the URL reads as Square's.
- No nonprofit discount at all.
- Subscription/recurring tooling is less mature than Stripe Billing.
- Primarily a retail POS product; the nonprofit path is a secondary use case.

**Verdict:** Not the primary system given the white-label priority, but a strong
**companion** to Stripe for meeting-night collection. Worth asking whether SH takes
in-person dues at all.

---

### 4.3 PayPal — offer as a secondary method, not the primary

**Cost:** $0/month. **Fees:** standard 2.89% + 49¢; **confirmed-charity rate 1.99% +
49¢** after applying and being approved (not automatic with 501(c)(3) status).

**Pros**
- Highest recognition and trust, especially with older members — a real consideration for
  a humanist chapter's likely demographic.
- Some members will already have a balance and can pay without entering card details.
- Copy-paste HTML buttons work trivially on a static site.
- Lowest percentage rate here if charity status is approved.

**Cons**
- **Not white-label in any sense** — PayPal branding is the whole point of PayPal, which
  directly contradicts requirement 3.
- **The 49¢ fixed fee is punishing at this ticket size.** On $30 dues, PayPal at the
  charity rate costs $1.09 vs Stripe's $1.17 — a saving of 8¢. The advertised rate
  advantage largely evaporates on small transactions.
- Checkout pushes account creation, adding friction for card-only payers.
- Historically poor account-freeze handling and support responsiveness.

**Verdict:** Don't build on it. Consider adding a PayPal button *alongside* Stripe purely
as a member convenience if members ask for it.

---

## 5. Ruled out — and why (for the record)

| Platform | Cost | Why ruled out |
|---|---|---|
| **WildApricot** | from $66/mo ($792/yr) | **The incumbent being replaced.** Also wants to be the website, conflicting with this project. |
| **Zeffy** | $0 | Not white-label — ~15–17% default tip prompt shown to members. Cheapest option if that's acceptable. |
| **Givebutter** | $0 (or ~5.9% w/o tips) | Not white-label — tip prompt; disabling it costs ~5.9%. |
| **MembershipWorks** | $0 ≤50 members, then $35/mo | A member CMS — requirement 1 says not needed. Would be the pick if SH wanted to keep CMS features. |
| **Donorbox** | $0 + **3.95% on memberships** | Branded, and memberships are its most expensive category — 7.15% + 30¢ all-in. |
| **Join It** | $29/mo + 1.5–3% + Stripe | Fee stacking; a member CMS; ~$418/yr. |
| **Bloomerang / Neon One / Kindful** | $100–300+/mo | Donor CRMs for orgs with development staff. Out of scope on cost and purpose. |

---

## 6. Fees: what SH will actually pay

**501(c)(3) status is confirmed, which makes the nonprofit rates *available in
principle*. But there's a catch specific to membership dues:**

> Stripe's nonprofit discount (2.2% + 30¢ vs standard 2.9% + 30¢) requires that **>80% of
> payment volume be tax-deductible donations**. Stripe explicitly excludes **membership
> fees**, ticket sales, tuition, registration fees, and auction payments. PayPal's
> charity rate is framed the same way.

So if SH's volume is mostly *dues*, budget the **standard 2.9% + 30¢**. Two paths:

- **(a) Structure membership as a suggested donation** — "join with a suggested gift of
  $X/year." Unlocks the discounted rate, and is genuinely more accurate if members receive
  no substantial goods or services in return. Worth a conversation with whoever prepares
  SH's Form 990.
- **(b) Keep calling it dues** — accept standard rates. Simpler and unambiguous.

Either way, **apply to `nonprofit@stripe.com`** (EIN + IRS determination letter + 80%
attestation). If SH also takes general donations through the same account and those
dominate, the discount may apply across the board. Applying is free and the rate is
retroactive to nothing, so do it early — charges bill at standard rates until approved.

**Worked example — 60 members × $30/year = $1,800:**

| Option | Fixed/yr | Variable/yr | **Total/yr** | % |
|---|---|---|---|---|
| Stripe (standard 2.9% + 30¢) | $0 | $70.20 | **$70** | 3.9% |
| Stripe + custom domain | $120 | $70.20 | **$190** | 10.6% |
| Stripe (if 2.2% discount applies) | $0 | $57.60 | **$58** | 3.2% |
| Square (online) | $0 | $70.20 | **$70** | 3.9% |
| PayPal (charity rate) | $0 | $65.20 | **$65** | 3.6% |
| — *Zeffy / Givebutter, if white-label were dropped* | $0 | $0 | **$0** | 0% |
| — *WildApricot today (baseline)* | $792 | $0 | **$792** | 44% |

**Headline: migrating from WildApricot to Stripe saves roughly $720/year** — about 40% of
total dues revenue at this scale. Even with the custom domain, the saving is ~$600/yr.
Replace the member count and dues amount with SH's real figures to firm this up.

Note the fixed per-transaction fee is the hidden cost at this ticket size: 30¢ on $30 is
1% by itself. **Bill dues annually, not monthly** — twelve $2.50 charges would lose 12%
to fixed fees alone.

---

## 7. Recommendation

**Stripe Payment Links**, with a custom domain if the board wants the branded URL.

It is the only option that satisfies all five requirements: no CMS, pure link-out, the
best white-label controls available in a hosted product, a clean exit from WildApricot
that also covers the member-roster job, and zero backend requirements. No tip prompt, no
monthly platform fee, direct settlement to SH's bank, and CSV export so this migration
never has to happen again.

**Two decisions for the board:**

1. **Custom domain — recommend skipping it, at least initially.** Stripe charges **$10/mo
   (USD, billed monthly in arrears)** to serve its hosted pages from your subdomain. Note
   this is *not* domain registration — SH already owns stanislaushumanists.org; this is
   purely Stripe's fee for the CNAME arrangement. Three reasons to skip:
   - **$120/yr is 6.7% of ~$1,800 dues revenue for a cosmetic URL change** — more than a
     full year of actual processing fees (~$70).
   - **The trust argument may run backwards.** `checkout.stripe.com` is a domain members
     already recognize. An unfamiliar `checkout.stanislaushumanists.org` is not obviously
     more reassuring for a small local nonprofit — it may be less so.
   - **It's reversible.** Add it later if the hand-off actually bothers anyone.

   The free branding controls (logo, background color, button color, font) do the bulk of
   the white-labeling work at $0. Take those; skip the domain.
2. **Is minor "powered by Stripe" attribution acceptable?** If the requirement is
   literally zero third-party mark, no hosted option clears that bar, and the alternative
   is a self-hosted Stripe Elements form — which needs a backend and would mean giving up
   pure static hosting. I'd advise accepting the attribution.

**Also worth asking:** does SH collect dues in person at meetings? If so, add Square for
tap-to-pay at 2.6% + 10¢ rather than forcing everyone through the website.

---

## 8. Open questions

1. **What does SH actually use in WildApricot today** — just dues and roster, or also the
   member directory, content gating, event registration, and member emails? (§3) This is
   the one that could change the recommendation.
2. **Actual member count and dues tiers** (individual / household / student / lifetime?)
   — needed to firm up §6.
3. **One-time annual, or auto-renewing?** Auto-renew materially improves retention and
   Stripe handles it well, but it means storing payment credentials.
4. **Dues or donation?** (§6a vs §6b) — decides whether the discounted rate is available
   and affects receipt wording.
5. **Does SH have a Stripe account already,** or is WildApricot's built-in processor
   handling everything today?
6. **What's the WildApricot renewal date?** Don't cancel before member data is exported
   and the new flow is live — export via *Members → Summary → Export all* (XLS/CSV/XML,
   with selectable fields).
7. **Where does the member list live after migration?** Stripe Customers export, a Google
   Sheet, or Mailchimp — worth deciding deliberately rather than by default.
8. **Who administers this month to month?**

---

## 9. Implementation sketch

Roughly a half-day of work, most of it in the Stripe Dashboard rather than in code.

**In Stripe (no code):**
1. Create the SH account; verify the bank account and 501(c)(3) details.
2. Email `nonprofit@stripe.com` to apply for the discounted rate (§6).
3. Create a Product per membership tier, with an annual recurring Price.
4. Create a Payment Link per tier; add custom fields for the member details SH needs.
5. Set branding — logo, colors — under Settings → Branding.
6. *Skip initially (§7):* Settings → Custom domains, add the CNAME to the DNS for
   stanislaushumanists.org. $10/mo — easy to add later if the board wants it.

**In this project:**
7. Add styled anchor buttons in the Membership section pointing at each Payment Link.
   That's the whole integration — no scripts, no CSP changes, nothing to break at build
   time.

**Migration:**
8. Export all members and contacts from WildApricot before cancelling.
9. Run both in parallel for one renewal cycle if the timing allows.
10. Cancel WildApricot.

**Note on a possible refinement:** Stripe also offers an embeddable *buy button* if a
link-out proves too abrupt. It injects a script tag, so in Solid it would load in
`onMount` and mount into a `ref` div with cleanup on unmount — and since this site uses a
**hash router**, verify the widget tolerates hash URLs and doesn't rewrite
`window.location`. Start with the plain link; only add this if the hand-off is a problem.

---

## Sources

- [Stripe Pricing](https://stripe.com/pricing)
- [Stripe — Payment Links documentation](https://docs.stripe.com/payment-links)
- [Stripe — Customize checkout for Payment Links](https://docs.stripe.com/payment-links/customize)
- [Stripe — Use your custom domain](https://docs.stripe.com/payments/checkout/custom-domains)
- [Stripe — Custom domain FAQ](https://support.stripe.com/questions/custom-domain-on-stripe-checkout-faq)
- [Stripe — Fee discount for nonprofit organizations](https://support.stripe.com/questions/fee-discount-for-nonprofit-organizations)
- [Stripe's Nonprofit Discount: How It Works, and the Catch — Whitelabel](https://www.whitelabel.ai/blog/stripe-nonprofit-discount)
- [WildApricot — Exporting members and contacts](https://gethelp.wildapricot.com/en/articles/152-exporting-members-and-contacts)
- [WildApricot Pricing](https://www.wildapricot.com/pricing)
- [PayPal Nonprofit Fees 2026 — Zeffy](https://www.zeffy.com/blog/paypal-donation-fees-for-nonprofits)
- [PayPal Nonprofit Donation Fees — Donorbox](https://donorbox.org/nonprofit-blog/paypal-nonprofit-donation-fees)
- [Zeffy — pricing model](https://www.zeffy.com/)
- [Zeffy Review 2026 — Authencio](https://www.authencio.com/blog/zeffy-deep-dive-zero-fee-fundraising-donor-management-pricing-pros-cons-best-alternatives)
- [Givebutter Pricing](https://givebutter.com/pricing)
- [Donorbox Pricing](https://donorbox.org/pricing)
- [MembershipWorks Pricing — Capterra](https://www.capterra.com/p/137032/MembershipWorks/pricing/)
- [8 Best Nonprofit Credit Card Processing Options — Bloomerang](https://bloomerang.com/blog/nonprofit-credit-card-processing)
