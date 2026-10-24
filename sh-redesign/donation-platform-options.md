# Donation platform options

**The rule:** use one donation platform, not several. Pick the long-term one
early, because monthly donors usually can't be moved between platforms; they
have to sign up again.

Status: separate project, not started. Currently Stripe; Stripe is likely not
the final choice. The demo site mocks Zeffy.

Source: the *Humanist Organizer Playbook* (AHA, 2026) names Zeffy, GiveButter and
ActBlue as alternatives for recurring micro-donations (p.65). It doesn't suggest
using all three.

## Why only one

- **Split records.** Donor history, recurring donors and receipts end up in
  several dashboards. The treasurer reconciles all of them, and "thank every
  gift fast and personally" (PB p.65) gets harder.
- **More accounts to secure.** Each one needs two admins and 2FA (PB p.42).
- **Donor confusion.** Different donation pages in different places can look
  like a scam.
- **Recurring gifts don't transfer.** Switching later means asking every monthly
  donor to sign up again.

## Candidates

- Stripe (current)
- Zeffy (mocked in the demo)
- GiveButter
- ActBlue
- ActionNetwork (if it can take donations with a connected payment processor)

## What to check

1. **ActBlue's partisan look.** ActBlue is mostly known for Democratic
   campaigns. If the group is a 501(c)(3), the playbook warns that c3 status
   limits partisan politics (PB p.56). Even where it's allowed, it may look
   partisan to donors or the press.
2. **501(c)(3) status.** Some platforms, and Stripe's discounted nonprofit rate,
   require it. Confirm whether Stanislaus Humanists Inc. has it.
3. **How each platform makes money.** Not yet verified; check current terms.
   - Zeffy: free to the organization; asks donors for an optional "tip" at
     checkout, which some donors find off-putting.
   - GiveButter: optional donor tips or a platform fee.
   - Stripe: per-transaction fee; no tip prompt; you build or link the
     donation page yourself.
4. **Built-in donor features.** Automatic tax receipts, thank-you emails, a
   donor list, and recurring gifts that donors can change or cancel themselves.
   With Stripe these are mostly do-it-yourself; donation platforms include them.
5. **ActionNetwork first.** The demo assumes ActionNetwork for events and
   signups. One system for people *and* money may be the simplest answer, so
   check whether ActionNetwork's donation pages fit before comparing the others.
6. **Moving existing Stripe donors.** How many recurring donors are on Stripe
   now, and what asking them to switch would take.

## Next steps

1. Confirm 501(c)(3) status.
2. Check ActionNetwork's donation feature.
3. Build a side-by-side comparison (fees, tips, receipts, recurring management,
   partisan perception) of the remaining candidates.
4. Board picks one.
