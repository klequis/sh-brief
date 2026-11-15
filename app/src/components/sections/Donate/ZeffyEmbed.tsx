import type { Component } from 'solid-js';
import { Show, createSignal, onCleanup, onMount } from 'solid-js';

import { zeffyCampaign } from '../../../data/zeffyCampaign';
import styles from './ZeffyEmbed.module.css';

// Integration 2: Zeffy's donation form inside our page.
//
// This is the "Embedded form" code from the campaign's Share dialog, rewritten
// for Solid. Zeffy's snippet is a <div data-zeffy-embed> plus a <script> whose
// inline onerror swaps in a plain iframe when the script won't load. Two
// changes:
// - The script is added in onMount, so it only ever runs in the browser. The
//   prerender (scripts/prerender.mjs) runs in Node and outputs just the
//   placeholder box.
// - The fallback is a signal instead of the inline onerror. It also kicks in
//   when the script loads but no form has appeared after FORM_TIMEOUT_MS.

const EMBED_SCRIPT_URL = 'https://www.zeffy.com/embed/v2/zeffy-embed.js';
const FORM_TIMEOUT_MS = 10_000;

const ZeffyEmbed: Component = () => {
  const [isFormShown, setFormShown] = createSignal(false);
  const [isFallbackShown, setFallbackShown] = createSignal(false);

  let embedTarget: HTMLDivElement | undefined;

  onMount(() => {
    if (!embedTarget) return;

    // Zeffy's script fills the data-zeffy-embed div with its own iframe. We
    // can't see inside that, so "the form is showing" means "the div has
    // children now".
    const observer = new MutationObserver(() => {
      if (embedTarget && embedTarget.childElementCount > 0) {
        setFormShown(true);
        observer.disconnect();
        window.clearTimeout(timeout);
      }
    });
    observer.observe(embedTarget, { childList: true });

    const showFallback = () => {
      observer.disconnect();
      window.clearTimeout(timeout);
      setFallbackShown(true);
    };

    const timeout = window.setTimeout(showFallback, FORM_TIMEOUT_MS);

    const script = document.createElement('script');
    script.src = EMBED_SCRIPT_URL;
    script.async = true;
    script.addEventListener('error', showFallback);
    document.body.appendChild(script);

    onCleanup(() => {
      observer.disconnect();
      window.clearTimeout(timeout);
      script.remove();
    });
  });

  return (
    <div class={styles.zeffyEmbed}>
      <Show when={!isFormShown() && !isFallbackShown()}>
        <p class={styles.loadingBox}>Loading the donation form…</p>
      </Show>
      <Show
        when={!isFallbackShown()}
        fallback={
          <iframe
            class={styles.fallbackIframe}
            title="Donation form powered by Zeffy"
            src={zeffyCampaign.embedFallbackUrl}
            allow="payment"
          />
        }
      >
        <div ref={embedTarget} data-zeffy-embed data-form-url={zeffyCampaign.embedFormPath} />
      </Show>
    </div>
  );
};

export default ZeffyEmbed;
