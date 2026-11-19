/* @refresh reload */
import { hydrate, render } from 'solid-js/web';
import 'solid-devtools';

import './styles/global.css';
import App from './App';

const root = document.getElementById('root');

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    'Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?',
  );
}

// Production builds are prerendered (scripts/prerender.mjs), so #root already
// holds the markup and its hydration markers — adopt it instead of rebuilding,
// which keeps the prerendered paint on screen rather than flashing it away.
// The dev server serves index.html unprocessed, leaving #root empty, and
// hydrate() on an empty container has no markers to adopt and renders nothing.
if (import.meta.env.DEV) {
  render(() => <App />, root!);
} else {
  hydrate(() => <App />, root!);
}

// Addresses from before the site dropped its hash router look like
// "#/membership" or "#/about-us/board", and may still be out there in posts
// and bookmarks. The section to show was always the last part, so rewrite them
// to "#membership" / "#board" ("#/" to "#home").
//
// location.replace() rather than history.replaceState(): it is a real
// fragment navigation, so the browser scrolls to the section itself (with the
// header offset from scroll-margin-top) and the old address leaves no entry
// in Back. Runs after render/hydrate so the section exists in dev too, and
// again on hashchange, because typing a "#/..." address into a tab that
// already shows the site changes only the fragment and doesn't reload.
function redirectOldRouterAddress() {
  const oldRouterHash = window.location.hash.match(/^#\/(.*)$/);
  if (!oldRouterHash) return;
  const sectionId = oldRouterHash[1].split('/').filter(Boolean).pop() ?? 'home';
  window.location.replace(`#${sectionId}`);
}

redirectOldRouterAddress();
window.addEventListener('hashchange', redirectOldRouterAddress);
