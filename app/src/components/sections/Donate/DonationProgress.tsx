import type { Component } from 'solid-js';
import { For, Match, Show, Switch, createSignal, onMount } from 'solid-js';

import type { DonationProgress as DonationProgressData } from '../../../worker/donationProgress';
import styles from './DonationProgress.module.css';

// Integration 3: the campaign's real amount raised toward its goal, and its
// latest gifts (amount and date only), from /api/donation-progress. The route
// caches for 5 minutes, so a new gift shows up within about that long.
//
// Never shows made-up numbers: while loading, and if the route fails or isn't
// there (as under `pnpm dev`, which runs no Worker), it says so in words.

async function fetchDonationProgress(): Promise<DonationProgressData> {
  const response = await fetch('/api/donation-progress');
  if (!response.ok) throw new Error(`/api/donation-progress returned ${response.status}`);
  return (await response.json()) as DonationProgressData;
}

// Whole dollars when the amount is whole ($1,000, not $1,000.00).
function formatMoney(cents: number, currency: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
    minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
  }).format(cents / 100);
}

const giftDateFormat = new Intl.DateTimeFormat('en-US', {
  month: 'long',
  day: 'numeric',
  year: 'numeric',
});

type DonationProgressLoadState =
  | { status: 'loading' }
  | { status: 'unavailable' }
  | { status: 'loaded'; progress: DonationProgressData };

const DonationProgress: Component = () => {
  // Plain signal set from onMount, not createResource: onMount runs only in
  // the browser, after hydration has taken over the prerendered "Loading…"
  // text, so every later state change reaches the page. With createResource
  // the section stayed on "Loading…" after a failed fetch.
  const [loadState, setLoadState] = createSignal<DonationProgressLoadState>({
    status: 'loading',
  });

  onMount(() => {
    fetchDonationProgress()
      .then((progress) => setLoadState({ status: 'loaded', progress }))
      .catch(() => setLoadState({ status: 'unavailable' }));
  });

  const loadedProgress = () => {
    const state = loadState();
    return state.status === 'loaded' ? state.progress : undefined;
  };

  return (
    <div class={styles.donationProgress}>
      <Switch fallback={<p class={styles.statusNote}>Loading the latest totals…</p>}>
        <Match when={loadState().status === 'unavailable'}>
          <p class={styles.statusNote}>Live totals are unavailable right now.</p>
        </Match>
        <Match when={loadedProgress()}>
          {(loaded) => {
            const goalPercent = () => {
              const goalCents = loaded().goalCents;
              if (!goalCents) return null;
              return Math.min(100, Math.round((loaded().raisedCents / goalCents) * 100));
            };
            return (
              <>
                <p class={styles.raisedLine}>
                  <strong>{formatMoney(loaded().raisedCents, loaded().currency)}</strong>{' '}
                  raised
                  <Show when={loaded().goalCents}>
                    {(goalCents) => <> of our {formatMoney(goalCents(), loaded().currency)} goal</>}
                  </Show>
                </p>
                <Show when={goalPercent() !== null}>
                  <div
                    class={styles.progressTrack}
                    role="progressbar"
                    aria-label="Amount raised toward the goal"
                    aria-valuemin="0"
                    aria-valuemax="100"
                    aria-valuenow={goalPercent()!}
                  >
                    <div class={styles.progressFill} style={{ width: `${goalPercent()}%` }} />
                  </div>
                </Show>
                <Show
                  when={loaded().recentGifts.length > 0}
                  fallback={<p class={styles.statusNote}>No gifts yet. Yours could be the first.</p>}
                >
                  <h3 class={styles.recentGiftsHeading}>Latest gifts</h3>
                  <ul class={styles.recentGifts}>
                    <For each={loaded().recentGifts}>
                      {(gift) => (
                        <li>
                          {formatMoney(gift.amountCents, loaded().currency)},{' '}
                          <time datetime={gift.createdAt}>
                            {giftDateFormat.format(new Date(gift.createdAt))}
                          </time>
                        </li>
                      )}
                    </For>
                  </ul>
                </Show>
              </>
            );
          }}
        </Match>
      </Switch>
    </div>
  );
};

export default DonationProgress;
