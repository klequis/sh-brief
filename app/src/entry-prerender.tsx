/**
 * Build-time entry point. Never shipped to the browser — scripts/prerender.mjs
 * bundles this for Node, calls renderPage(), and injects the result into
 * dist/index.html so the served document contains the page copy as real HTML
 * instead of an empty <div id="root">.
 */
import { StaticRouter } from '@solidjs/router';
import { generateHydrationScript, renderToString } from 'solid-js/web';

import App from './App';
import type { RouterComponent } from './App';

// StaticRouter rather than MemoryRouter: MemoryRouter installs the native link
// and popstate handlers on mount, which reach for document and throw under
// renderToString. StaticRouter skips all of that and just resolves one URL.
// "/" is the only route anyway — App's single route is a catch-all.
const PrerenderRouter: RouterComponent = (props) => (
  <StaticRouter {...props} url="/" />
);

export function renderPage(): { html: string; head: string } {
  return {
    // renderToString emits Solid's hydration markers, which the browser entry
    // needs to adopt this markup rather than rebuild it.
    html: renderToString(() => <App router={PrerenderRouter} />),
    head: generateHydrationScript(),
  };
}
