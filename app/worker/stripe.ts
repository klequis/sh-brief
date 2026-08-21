/**
 * The two Stripe calls the join flow makes, over the REST API with plain fetch().
 *
 * No Stripe SDK on purpose: the npm package is large and module initialization
 * counts against the Workers free tier's 10ms CPU budget, while waiting on
 * fetch() does not. See discussion-issues item 13.
 */

const STRIPE_API = 'https://api.stripe.com/v1';

async function stripePost(
  path: string,
  body: URLSearchParams,
  secretKey: string,
): Promise<any> {
  const response = await fetch(`${STRIPE_API}${path}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${secretKey}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  });

  const json = (await response.json()) as any;
  if (!response.ok) {
    // Stripe puts the useful part in error.message; surface it in the Worker's
    // logs rather than a bare status code, because "400" alone tells us nothing
    // about which of a dozen parameters was wrong.
    throw new Error(json?.error?.message ?? `Stripe ${response.status}`);
  }
  return json;
}

export interface MembershipFields {
  agreesToPrinciples: boolean;
  autoRenew: boolean;
  secondMemberName: string;
  secondMemberAddress: string;
  secondMemberEmail: string;
}

/**
 * Creates the Customer that carries SH's own questions.
 *
 * This call exists because Checkout has no parameter that writes metadata to a
 * Customer — only to the Session, the Subscription, or the PaymentIntent, none
 * of which is the roster. The user story assumes otherwise; see
 * 02.implementation-plan.md §2.1.
 *
 * Deliberately carries no name, no email and no address. Stripe collects those
 * on its own page and writes them back via customer_update, so the member types
 * them once (item 17). Leaving email unset matters: setting one would make the
 * field non-editable at checkout.
 */
export function createCustomer(
  fields: MembershipFields,
  secretKey: string,
): Promise<any> {
  const body = new URLSearchParams({
    'metadata[agrees_to_principles]': String(fields.agreesToPrinciples),
    // Records the choice made at join, never the current state — a member who
    // cancels later in the Customer Portal leaves this reading 'true'. Current
    // state is the Subscription, which cannot drift because it *is* the billing
    // machinery. See item 19.
    'metadata[auto_renew_at_join]': String(fields.autoRenew),
    'metadata[second_member_name]': fields.secondMemberName,
    // Blank means "shares the household address". The checkbox on the form
    // copies nothing, because the household address lives on Stripe and does
    // not exist yet when the SH form is filled in (item 16).
    'metadata[second_member_address]': fields.secondMemberAddress,
    'metadata[second_member_email]': fields.secondMemberEmail,
    // Captured, never typed — criterion 17.
    'metadata[join_date]': new Date().toISOString().slice(0, 10),
  });

  return stripePost('/customers', body, secretKey);
}

export interface SessionOptions {
  customerId: string;
  levelName: string;
  annualAmountCents: number;
  autoRenew: boolean;
  /** 1-12. January takes a different proration branch — see below. */
  joinMonth: number;
  successUrl: string;
  cancelUrl: string;
}

export function createCheckoutSession(
  options: SessionOptions,
  secretKey: string,
): Promise<any> {
  const body = new URLSearchParams({
    customer: options.customerId,
    // Required whenever an existing customer is passed: without it Checkout
    // cannot write the name and billing address the member types back onto the
    // Customer, and the roster never gets an address.
    'customer_update[name]': 'auto',
    'customer_update[address]': 'auto',
    'line_items[0][quantity]': '1',
    'line_items[0][price_data][currency]': 'usd',
    'line_items[0][price_data][unit_amount]': String(options.annualAmountCents),
    'line_items[0][price_data][product_data][name]': options.levelName,
    success_url: options.successUrl,
    cancel_url: options.cancelUrl,
  });

  if (options.autoRenew) {
    body.set('mode', 'subscription');
    body.set('line_items[0][price_data][recurring][interval]', 'year');

    // Stripe resolves February 1 itself, short months and leap years included.
    // The alternative parameter, billing_cycle_anchor, takes a Unix timestamp
    // the Worker would have to compute — which is the hand-rolled date maths
    // item 11 exists to avoid.
    body.set('subscription_data[billing_cycle_anchor_config][month]', '2');
    body.set('subscription_data[billing_cycle_anchor_config][day_of_month]', '1');

    // A January joiner owes nothing today and pays the full annual rate on
    // February 1 (§7.5). Turning prorations off expresses that directly.
    //
    // The user story builds this branch as a trial ending February 1 instead.
    // That does not work: subscription_data[trial_end] "has to be at least 48
    // hours in the future", so a join on January 30 or 31 is rejected — the
    // exact failure the January rule exists to prevent. See §2.2.
    //
    // UNVERIFIED. Needs a sandbox test clock set to January: confirm $0 at
    // checkout, a payment method still collected, and the first real invoice on
    // February 1. Building in August never exercises this path.
    body.set(
      'subscription_data[proration_behavior]',
      options.joinMonth === 1 ? 'none' : 'create_prorations',
    );
  } else {
    body.set('mode', 'payment');
    // No customer_creation needed: passing an explicit customer means Stripe has
    // nothing left to create, so the guest-customer failure mode items 7 and 21
    // warn about cannot occur in either branch.
    //
    // OPEN: this charges the full annual rate. Payment mode does not prorate —
    // Stripe charges unit_amount exactly — so what a decliner actually owes is a
    // decision the user story never makes. See 02.implementation-plan.md §10 #1.
  }

  return stripePost('/checkout/sessions', body, secretKey);
}
