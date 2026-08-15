import type { Component, ParentComponent } from 'solid-js';
import { HashRouter, Route } from '@solidjs/router';
import type { RouterProps } from '@solidjs/router';

import RootLayout from './routes/RootLayout';
import Sections from './routes/Sections';

// The prerender pass renders this same tree under MemoryRouter, because
// HashRouter reads window.location and there is no window in Node. Swapping the
// router is safe for hydration: the only route is the catch-all below, so every
// router resolves to the same <Sections /> and produces identical markup.
// See scripts/prerender.mjs.
export type RouterComponent = ParentComponent<Omit<RouterProps, 'children'>>;

const App: Component<{ router?: RouterComponent }> = (props) => {
  const Router = props.router ?? (HashRouter as RouterComponent);

  return (
    <Router root={RootLayout}>
      <Route path="*" component={Sections} />
    </Router>
  );
};

export default App;
