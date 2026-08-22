import { action } from '@solidjs/router';

/**
 * The join action.
 *
 * No "use server": this app has no SolidStart server. The action runs in the
 * browser and calls the Cloudflare Worker, which is where the Stripe secret key
 * lives. Everything about that split is in doc membership-payment-process/
 * 02.implementation-plan.md §4.
 *
 * Returns an envelope rather than throwing, so a failure renders as a message
 * beside the form instead of an error thrown into the reactive graph.
 */

export type JoinResult =
  | { ok: true; url: string }
  | { ok: false; error: string };

const LEVELS = ['individual', 'household'] as const;
type Level = (typeof LEVELS)[number];

function isLevel(value: unknown): value is Level {
  return LEVELS.includes(value as Level);
}

export const joinAction = action(async (data: FormData): Promise<JoinResult> => {
  const level = data.get('level');
  if (!isLevel(level)) {
    return { ok: false, error: 'Please choose a membership level.' };
  }

  if (data.get('agrees_to_principles') !== 'on') {
    return {
      ok: false,
      error: 'Please confirm you agree with the seven Humanist Principles.',
    };
  }

  const household = level === 'household';
  // Blank records "the second member shares the household address". Nothing is
  // copied: the household address is collected by Stripe and does not exist yet
  // when this form is filled in.
  const sharesAddress = data.get('same_address') === 'on';

  const payload = {
    level,
    agreesToPrinciples: true,
    autoRenew: data.get('auto_renew') === 'on',
    secondMemberName: household ? String(data.get('second_member_name') ?? '') : '',
    secondMemberAddress:
      household && !sharesAddress
        ? String(data.get('second_member_address') ?? '')
        : '',
    secondMemberEmail: household ? String(data.get('second_member_email') ?? '') : '',
  };

  try {
    const response = await fetch('/api/join', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const result = (await response.json()) as { url?: string; error?: string };
    if (!response.ok || !result.url) {
      return { ok: false, error: result.error ?? 'Could not start checkout.' };
    }

    return { ok: true, url: result.url };
  } catch {
    return { ok: false, error: 'Network problem — checkout was not started.' };
  }
}, 'join');
