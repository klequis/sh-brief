import type { Component } from 'solid-js';
import { For, createEffect } from 'solid-js';
import { A } from '@solidjs/router';

import { siteConfig, navLinks } from '../../data/site';
import { createActiveSection } from '../../hooks/createActiveSection';
import styles from './Header.module.css';

const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const Header: Component = () => {
  const activeId = createActiveSection(navLinks.map((link) => link.id));

  let navRef: HTMLElement | undefined;
  const linkRefs: Record<string, HTMLAnchorElement> = {};

  // Below the breakpoint the nav scrolls sideways, so the active pill can end up
  // off-screen — which would leave the reader with no position indicator at all
  // on exactly the screens where the page feels endless. Centering it also puts
  // the neighbouring sections in view as the obvious next taps.
  //
  // Scrolls the nav element directly instead of calling scrollIntoView on the
  // pill: scrollIntoView walks up and scrolls every scrollable ancestor, which
  // here means fighting the page's own smooth scroll.
  createEffect(() => {
    const link = linkRefs[activeId()];
    if (!navRef || !link) return;
    navRef.scrollTo({
      left: link.offsetLeft - (navRef.clientWidth - link.offsetWidth) / 2,
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    });
  });

  return (
    <header class={styles.header}>
      <div class={`container ${styles.inner}`}>
        <A href="/" noScroll class={styles.brand}>
          <img
            src={`${import.meta.env.BASE_URL}logo.png`}
            alt=""
            class={styles.logo}
          />
          <span>
            <span class={styles.orgName}>{siteConfig.orgName}</span>
            <span class={styles.tagline}>{siteConfig.tagline}</span>
          </span>
        </A>
        <nav ref={navRef} class={styles.nav} aria-label="Sections">
          <For each={navLinks}>
            {(link) => (
              <A
                // Callback form only — <A> forwards props.ref through Solid's
                // spread helper, which ignores anything that isn't a function.
                ref={(el: HTMLAnchorElement) => (linkRefs[link.id] = el)}
                href={link.href}
                noScroll
                class={styles.navLink}
                classList={{ [styles.navLinkActive]: activeId() === link.id }}
              >
                {link.label}
              </A>
            )}
          </For>
        </nav>
      </div>
    </header>
  );
};

export default Header;
