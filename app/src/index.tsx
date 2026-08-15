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
