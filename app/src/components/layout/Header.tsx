import type { Component } from 'solid-js';
import { For, createEffect, onCleanup, onMount } from 'solid-js';
import { A } from '@solidjs/router';

import { siteConfig, navLinks } from '../../data/site';
import { createActiveSection } from '../../hooks/createActiveSection';
import styles from './Header.module.css';

const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const Header: Component = () => {
  const activeId = createActiveSection(navLinks.map((link) => link.id));

  let headerRef: HTMLElement | undefined;
  let navRef: HTMLElement | undefined;
  const linkRefs: Record<string, HTMLAnchorElement> = {};

  // Sections offset their scroll targets by --header-height so headings don't
  // land under the sticky bar. The bar's height isn't a constant: the nav wraps
  // to a second row on phones, and to a third on the narrowest ones. So publish
  // the measured height instead of hardcoding one per breakpoint.
  //
  // This only ever writes --header-height, never --header-min-height, which is
  // what the header's own CSS sizes against — writing the measured value into
  // the property that determines it would be a feedback loop.
  onMount(() => {
    const header = headerRef;
    if (!header) return;

    const publishHeight = () => {
      document.documentElement.style.setProperty(
        '--header-height',
        // getBoundingClientRect over the observer's contentRect: the latter
        // excludes the header's bottom border, leaving headings 1px high.
        `${Math.ceil(header.getBoundingClientRect().height)}px`,
      );
    };

    const observer = new ResizeObserver(publishHeight);
    observer.observe(header);
    onCleanup(() => observer.disconnect());
  });

  // The nav wraps rather than scrolls at the widths where the pills don't fit,
  // so this is a no-op in the normal case — scrollTo does nothing once
  // scrollWidth equals clientWidth. It's here for the leftover case where the
  // nav does scroll sideways (see the overflow-x safety valve in the stylesheet)
  // and the active pill would otherwise sit off-screen, leaving the reader with
  // no position indicator at all.
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
    <header ref={headerRef} class={styles.header}>
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
