/**
 * Build-time entry point. Never shipped to the browser — scripts/prerender.mjs
 * bundles this for Node, calls renderPage(), and injects the result into
 * dist/index.html so the served document contains the page copy as real HTML
 * instead of an empty <div id="root">.
 */
import { StaticRouter } from '@solidjs/router';
import { mergeProps } from 'solid-js';
import { generateHydrationScript, renderToString } from 'solid-js/web';

import App from './App';
import type { RouterComponent } from './App';
import { structuredDataScript } from './seo/structuredData';

// StaticRouter rather than MemoryRouter: MemoryRouter installs the native link
// and popstate handlers on mount, which reach for document and throw under
// renderToString. StaticRouter skips all of that and just resolves one URL.
// "/" is the only route anyway — App's single route is a catch-all.
//
// StaticRouter is called as a plain function, not as <StaticRouter />. Solid
// adds a level to the hydration keys for every component, and in the browser
// App renders HashRouter directly under it. A <StaticRouter /> here added one
// extra level, so no key matched and the page never hydrated: in a production
// build Solid says nothing and just renders into detached elements, so the
// page looked right but never updated (live events, live Zeffy totals).
const PrerenderRouter: RouterComponent = (props) =>
  StaticRouter(mergeProps(props, { url: '/' }));

export function renderPage(): { html: string; head: string } {
  return {
    // renderToString emits Solid's hydration markers, which the browser entry
    // needs to adopt this markup rather than rebuild it.
    html: renderToString(() => <App router={PrerenderRouter} />),
    // JSON-LD goes in the head next to the hydration script. Both are
    // build-time output; neither is part of the client bundle.
    head: generateHydrationScript() + structuredDataScript(),
  };
}
