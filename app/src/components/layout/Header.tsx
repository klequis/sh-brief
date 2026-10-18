import type { Component } from 'solid-js';
import { For, createSignal, onCleanup, onMount } from 'solid-js';
import { A } from '@solidjs/router';

import { navLinks, siteConfig } from '../../data/site';
import { createActiveSection } from '../../hooks/createActiveSection';
import styles from './Header.module.css';

/** id of the hero element. The bar is see-through while the hero is under it. */
export const HERO_ID = 'hero';

/**
 * Fixed top bar: brand on the left, menu on the right. Links inline on desktop;
 * a menu button (hamburger) on phones, where five links would otherwise wrap
 * into two rows of pills.
 *
 * The bar sits over the hero photo, see-through, and turns solid once the hero
 * has scrolled out from under it — so the photo starts at the very top of the
 * page and the brand stays on screen while reading the sections.
 */
const Header: Component = () => {
  const activeId = createActiveSection(navLinks.map((link) => link.id));
  const [isOverHero, setIsOverHero] = createSignal(true);
  const [isMenuOpen, setIsMenuOpen] = createSignal(false);

  let headerRef: HTMLElement | undefined;
  let menuButtonRef: HTMLButtonElement | undefined;

  onMount(() => {
    const header = headerRef;
    if (!header) return;

    // Sections offset their scroll targets by --header-height so headings
    // don't land under the bar. Published as a measured value rather than a
    // constant so it follows the logo and font sizes at every width.
    const measure = () => {
      document.documentElement.style.setProperty(
        '--header-height',
        `${Math.ceil(header.getBoundingClientRect().height)}px`,
      );
    };
    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(header);

    // See-through while any of the hero is still under the bar.
    let frame = 0;
    const updateOverHero = () => {
      frame = 0;
      const hero = document.getElementById(HERO_ID);
      const heroBottom = hero?.getBoundingClientRect().bottom ?? 0;
      setIsOverHero(heroBottom > header.getBoundingClientRect().height);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(updateOverHero);
    };
    updateOverHero();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });

    // Escape and clicks outside close the menu, as people expect of a
    // dropdown. Escape returns focus to the button so keyboard users aren't
    // dropped at the top of the document.
    const onKeyDown = (evt: KeyboardEvent) => {
      if (evt.key === 'Escape' && isMenuOpen()) {
        setIsMenuOpen(false);
        menuButtonRef?.focus();
      }
    };
    const onPointerDown = (evt: PointerEvent) => {
      if (isMenuOpen() && !header.contains(evt.target as Node)) setIsMenuOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('pointerdown', onPointerDown);

    onCleanup(() => {
      resizeObserver.disconnect();
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('pointerdown', onPointerDown);
    });
  });

  return (
    <header
      ref={headerRef}
      class={styles.header}
      // An open menu needs a solid bar behind it even over the hero.
      classList={{ [styles.headerOverHero]: isOverHero() && !isMenuOpen() }}
    >
      <div class={`container ${styles.inner}`}>
        <A href="/" noScroll class={styles.brand}>
          <img src={`${import.meta.env.BASE_URL}logo.png`} alt="" class={styles.logo} />
          <span>
            <span class={styles.orgName}>{siteConfig.orgName}</span>
            <span class={styles.tagline}>{siteConfig.tagline}</span>
          </span>
        </A>

        <button
          ref={menuButtonRef}
          type="button"
          class={styles.menuButton}
          aria-expanded={isMenuOpen()}
          aria-controls="site-menu"
          aria-label={isMenuOpen() ? 'Close menu' : 'Open menu'}
          onClick={() => setIsMenuOpen(!isMenuOpen())}
        >
          {/* Three bars, or an X while open. Drawn in SVG so it inherits the
              bar's text colour, white over the hero and dark once solid. */}
          <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true">
            {isMenuOpen() ? (
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" />
            )}
          </svg>
        </button>

        <nav
          id="site-menu"
          class={styles.nav}
          classList={{ [styles.navOpen]: isMenuOpen() }}
          aria-label="Sections"
        >
          <For each={navLinks}>
            {(link) => (
              <A
                href={link.href}
                noScroll
                class={styles.navLink}
                classList={{ [styles.navLinkActive]: activeId() === link.id }}
                aria-current={activeId() === link.id ? 'location' : undefined}
                onClick={() => setIsMenuOpen(false)}
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
