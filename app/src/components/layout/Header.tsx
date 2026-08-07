import type { Component } from 'solid-js';
import { For } from 'solid-js';
import { A } from '@solidjs/router';

import { siteConfig, navLinks } from '../../data/site';
import styles from './Header.module.css';

const Header: Component = () => {
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
        <nav class={styles.nav}>
          <For each={navLinks}>
            {(link) => (
              <A href={link.href} noScroll>
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
