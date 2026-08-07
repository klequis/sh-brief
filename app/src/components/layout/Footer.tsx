import type { Component } from 'solid-js';
import { A } from '@solidjs/router';

import { siteConfig } from '../../data/site';
import SocialLinks from '../ui/SocialLinks';
import styles from './Footer.module.css';

const Footer: Component = () => {
  return (
    <footer class={styles.footer}>
      <div class={`container ${styles.inner}`}>
        <nav class={styles.quickLinks}>
          <A href="/membership" noScroll>
            Membership
          </A>
          {' | '}
          <A href="/events" noScroll>
            Events
          </A>
          {' | '}
          <A href="/contact" noScroll>
            Contact Us
          </A>
          {' | '}
          <A href="/about-us/board" noScroll>
            Governance
          </A>
        </nav>
        <SocialLinks class={styles.social} />
        <p class={styles.copyright}>{siteConfig.copyright}</p>
      </div>
    </footer>
  );
};

export default Footer;
