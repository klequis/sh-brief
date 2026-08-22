import type { Component } from 'solid-js';
import { Show } from 'solid-js';
import { createStore } from 'solid-js/store';
import { useAction, useSubmission } from '@solidjs/router';

import { joinAction } from '../../../lib/join/actions';

/**
 * Skeleton join form. Unstyled on purpose — this exists to prove the path from
 * the site to Stripe, not to be the finished Membership section. The principles
 * grid, the Join banner and the header Join control are all still to come
 * (criteria 1-8).
 *
 * The rule this follows: anything Stripe collects is not asked for here. No
 * name, no email, no address, and above all no payment information — that is
 * entered only on checkout.stripe.com, which is what keeps SH in PCI-DSS SAQ A.
 *
 * The field values are read off the FormData by the action, so the only state
 * held here is what decides which fields are on screen.
 */
const JoinForm: Component = () => {
  const [form, setForm] = createStore({
    level: 'individual' as 'individual' | 'household',
    sameAddress: true,
  });

  const join = useAction(joinAction);
  const submission = useSubmission(joinAction);

  const isHousehold = () => form.level === 'household';

  const error = () => {
    const result = submission.result;
    return result && !result.ok ? result.error : '';
  };

  const handleSubmit = async (event: SubmitEvent) => {
    event.preventDefault();
    const result = await join(new FormData(event.currentTarget as HTMLFormElement));
    // A returned envelope means the action handled it; the message renders from
    // submission.result, so there is nothing to do here but leave.
    if (result?.ok) window.location.href = result.url;
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Join</h3>

      <fieldset>
        <legend>Membership level</legend>
        <label>
          <input
            type="radio"
            name="level"
            value="individual"
            checked={form.level === 'individual'}
            onChange={() => setForm('level', 'individual')}
          />{' '}
          Individual — $24.00/yr
        </label>
        <br />
        <label>
          <input
            type="radio"
            name="level"
            value="household"
            checked={form.level === 'household'}
            onChange={() => setForm('level', 'household')}
          />{' '}
          Household — $36.00/yr (up to 2 members)
        </label>
      </fieldset>

      <Show when={isHousehold()}>
        <fieldset>
          <legend>Second household member</legend>
          <label>
            Name <input type="text" name="second_member_name" />
          </label>
          <br />
          <label>
            Email (optional) <input type="email" name="second_member_email" />
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
              name="same_address"
              checked={form.sameAddress}
              onChange={(e) => setForm('sameAddress', e.currentTarget.checked)}
            />{' '}
            Lives at the same address
          </label>
          <Show when={!form.sameAddress}>
            <br />
            <label>
              Address <input type="text" name="second_member_address" />
            </label>
          </Show>
        </fieldset>
      </Show>

      <p>
        <label>
          <input type="checkbox" name="agrees_to_principles" />{' '}
          I agree with the seven Humanist Principles
        </label>
      </p>

      {/* Unchecked by default is a legal requirement, not a preference:
          California's Automatic Renewal Law requires express affirmative
          consent, and a box the member never touched is not consent. Do not
          pre-tick this to lift the opt-in rate. See user story §9.1a. */}
      <p>
        <label>
          <input type="checkbox" name="auto_renew" /> Renew my membership
          automatically each February 1. You can cancel at any time and stay a
          member through January 31 of the year you have paid for.
        </label>
      </p>

      <button type="submit" disabled={submission.pending}>
        {submission.pending ? 'Starting checkout…' : 'Continue to payment'}
      </button>

      <Show when={error()}>
        <p role="alert">{error()}</p>
      </Show>
    </form>
  );
};

export default JoinForm;
