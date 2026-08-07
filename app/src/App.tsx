import type { Component } from 'solid-js';
import { HashRouter, Route } from '@solidjs/router';

import RootLayout from './routes/RootLayout';
import Sections from './routes/Sections';

const App: Component = () => {
  return (
    <HashRouter root={RootLayout}>
      <Route path="*" component={Sections} />
    </HashRouter>
  );
};

export default App;
