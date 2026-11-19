/**
 * Build-time entry point. Never shipped to the browser — scripts/prerender.mjs
 * bundles this for Node, calls renderPage(), and injects the result into
 * dist/index.html so the served document contains the page copy as real HTML
 * instead of an empty <div id="root">.
 */
import { generateHydrationScript, renderToString } from 'solid-js/web';

import App from './App';
import { structuredDataScript } from './seo/structuredData';

// The browser entry (src/index.tsx) hydrates <App /> directly under hydrate(),
// so this renders it directly under renderToString(). Solid adds a level to
// the hydration keys for every component, so any wrapper added on one side and
// not the other means no key matches and the page silently never hydrates: in
// a production build Solid says nothing and draws updates (live events, the
// header's section highlight) into detached elements.
export function renderPage(): { html: string; head: string } {
  return {
    // renderToString emits Solid's hydration markers, which the browser entry
    // needs to adopt this markup rather than rebuild it.
    html: renderToString(() => <App />),
    // JSON-LD goes in the head next to the hydration script. Both are
    // build-time output; neither is part of the client bundle.
    head: generateHydrationScript() + structuredDataScript(),
  };
}
