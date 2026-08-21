import type { Component } from 'solid-js';
import { Show, createSignal } from 'solid-js';

/**
 * Skeleton join form. Unstyled on purpose — this exists to prove the path from
 * the site to Stripe, not to be the finished Membership section. The principles
 * grid, the Join banner and the header Join control are all still to come
 * (criteria 1-8).
 *
 * The rule this follows: anything Stripe collects is not asked for here. No
 * name, no email, no address, and above all no payment information — that is
 * entered only on checkout.stripe.com, which is what keeps SH in PCI-DSS SAQ A.
 */
const JoinForm: Component = () => {
  const [level, setLevel] = createSignal<'household' | 'individual'>('individual');
  const [agrees, setAgrees] = createSignal(false);
  const [autoRenew, setAutoRenew] = createSignal(false);
  const [secondMemberName, setSecondMemberName] = createSignal('');
  const [secondMemberEmail, setSecondMemberEmail] = createSignal('');
  const [sameAddress, setSameAddress] = createSignal(true);
  const [secondMemberAddress, setSecondMemberAddress] = createSignal('');
  const [busy, setBusy] = createSignal(false);
  const [error, setError] = createSignal('');

  const isHousehold = () => level() === 'household';

  const submit = async (event: Event) => {
    event.preventDefault();
    setError('');

    if (!agrees()) {
      setError('Please confirm you agree with the seven Humanist Principles.');
      return;
    }

    setBusy(true);

    try {
      const response = await fetch('/api/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          level: level(),
          agreesToPrinciples: agrees(),
          autoRenew: autoRenew(),
          secondMemberName: isHousehold() ? secondMemberName() : '',
          // Blank records "shares the household address". Nothing is copied:
          // the household address lives on Stripe and does not exist yet.
          secondMemberAddress:
            isHousehold() && !sameAddress() ? secondMemberAddress() : '',
          secondMemberEmail: isHousehold() ? secondMemberEmail() : '',
        }),
      });

      const result = (await response.json()) as { url?: string; error?: string };
      if (!response.ok || !result.url) {
        throw new Error(result.error ?? 'Could not start checkout');
      }

      window.location.href = result.url;
    } catch (caught) {
      setError((caught as Error).message);
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit}>
      <h3>Join</h3>

      <fieldset>
        <legend>Membership level</legend>
        <label>
          <input
            type="radio"
            name="level"
            checked={level() === 'individual'}
            onInput={() => setLevel('individual')}
          />{' '}
          Individual — $24.00/yr
        </label>
        <br />
        <label>
          <input
            type="radio"
            name="level"
            checked={level() === 'household'}
            onInput={() => setLevel('household')}
          />{' '}
          Household — $36.00/yr (up to 2 members)
        </label>
      </fieldset>

      <Show when={isHousehold()}>
        <fieldset>
          <legend>Second household member</legend>
          <label>
            Name{' '}
            <input
              type="text"
              value={secondMemberName()}
              onInput={(e) => setSecondMemberName(e.currentTarget.value)}
            />
          </label>
          <br />
          <label>
            Email (optional){' '}
            <input
              type="email"
              value={secondMemberEmail()}
              onInput={(e) => setSecondMemberEmail(e.currentTarget.value)}
            />
          </label>
          {/* Consent is a copy requirement, not a mechanism: the payer is
              entering someone else's address, so the label has to say what
              happens to it. */}
          <br />
          <small>
            The second member will be added to our mailing list and can
            unsubscribe at any time.
          </small>
          <br />
          <label>
            <input
              type="checkbox"
              checked={sameAddress()}
              onInput={(e) => setSameAddress(e.currentTarget.checked)}
            />{' '}
            Lives at the same address
          </label>
          <Show when={!sameAddress()}>
            <br />
            <label>
              Address{' '}
              <input
                type="text"
                value={secondMemberAddress()}
                onInput={(e) => setSecondMemberAddress(e.currentTarget.value)}
              />
            </label>
          </Show>
        </fieldset>
      </Show>

      <p>
        <label>
          <input
            type="checkbox"
            checked={agrees()}
            onInput={(e) => setAgrees(e.currentTarget.checked)}
          />{' '}
          I agree with the seven Humanist Principles
        </label>
      </p>

      {/* Unchecked by default is a legal requirement, not a preference:
          California's Automatic Renewal Law requires express affirmative
          consent, and a box the member never touched is not consent. Do not
          pre-tick this to lift the opt-in rate. See user story §9.1a. */}
      <p>
        <label>
          <input
            type="checkbox"
            checked={autoRenew()}
            onInput={(e) => setAutoRenew(e.currentTarget.checked)}
          />{' '}
          Renew my membership automatically each February 1. You can cancel at
          any time and stay a member through January 31 of the year you have
          paid for.
        </label>
      </p>

      <button type="submit" disabled={busy()}>
        {busy() ? 'Starting checkout…' : 'Continue to payment'}
      </button>

      <Show when={error()}>
        <p role="alert">{error()}</p>
      </Show>
    </form>
  );
};

export default JoinForm;
