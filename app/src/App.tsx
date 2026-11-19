import type { Component } from 'solid-js';

import Header from './components/layout/Header';
import Sections from './components/layout/Sections';
import Footer from './components/layout/Footer';

// One page, no router. Every link to a section is a plain "#section-id"
// fragment, so the browser does the scrolling itself: smooth scrolling comes
// from scroll-behavior in global.css, the sticky header offset from
// scroll-margin-top, and clicking the link for the section you're already on
// scrolls back to it, with nothing in this app to keep in step.
const App: Component = () => {
  return (
    <>
      <Header />
      <main>
        <Sections />
      </main>
      <Footer />
    </>
  );
};

export default App;
