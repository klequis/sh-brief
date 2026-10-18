import type { Component } from 'solid-js';
import { createEffect, onCleanup, onMount } from 'solid-js';
import type { RouteSectionProps } from '@solidjs/router';

import Header from '../components/layout/Header';
import Hero from '../components/layout/Hero';
import Footer from '../components/layout/Footer';
import { UpcomingEventsProvider } from '../hooks/createUpcomingEvents';

// HashRouter consumes the whole "#..." as the route path, so there's no
// separate URL fragment left for the browser's native anchor scroll to use.
// Solid Router doesn't scroll to an element for us here, so we do it manually:
// the scroll target is always the last path segment, or "home" for "/".
//
// Every <A> in the app sets noScroll. Without it the router's own set() handler
// runs scrollToHash("", true) after the navigation transition resolves, which
// falls back to window.scrollTo(0, 0) and cancels the smooth scroll below.
function targetIdFromPathname(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean);
  return segments.length > 0 ? segments[segments.length - 1] : 'home';
}

// "Home" goes to the very top so the hero shows; #home itself starts below the
// hero and the nav.
function scrollToSection(id: string) {
  if (id === 'home') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

const RootLayout: Component<RouteSectionProps> = (props) => {
  createEffect(() => {
    scrollToSection(targetIdFromPathname(props.location.pathname));
  });

  // Re-clicking the link for the section you're already on is a no-op for the
  // router — navigateFromRoute bails when the resolved path equals the current
  // one — so the effect above never re-runs. Handle the click directly so the
  // link still scrolls back after you've scrolled away by hand.
  onMount(() => {
    const onClick = (evt: MouseEvent) => {
      if (evt.defaultPrevented || evt.button !== 0) return;
      const a = evt
        .composedPath()
        .find((el): el is HTMLAnchorElement => el instanceof HTMLAnchorElement);
      // The "link" attribute is set by <A>, so this skips mailto/external links.
      if (!a || !a.hasAttribute('link')) return;
      scrollToSection(targetIdFromPathname(new URL(a.href).hash.replace(/^#/, '')));
    };

    document.addEventListener('click', onClick);
    onCleanup(() => document.removeEventListener('click', onClick));
  });

  return (
    <UpcomingEventsProvider>
      <Hero />
      <Header />
      <main>{props.children}</main>
      <Footer />
    </UpcomingEventsProvider>
  );
};

export default RootLayout;
