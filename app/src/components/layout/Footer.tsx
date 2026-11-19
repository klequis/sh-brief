import type { Component } from 'solid-js';

import { siteConfig } from '../../data/site';
import SocialLinks from '../ui/SocialLinks';
import styles from './Footer.module.css';

const Footer: Component = () => {
  return (
    <footer class={styles.footer}>
      <div class={`container ${styles.inner}`}>
        <nav class={styles.quickLinks}>
          <a href="#membership">
            Membership
          </a>
          {' | '}
          <a href="#events">
            Events
          </a>
          {' | '}
          <a href="#contact">
            Contact Us
          </a>
          {' | '}
          <a href="#board">
            Governance
          </a>
        </nav>
        <SocialLinks class={styles.social} />
        <p class={styles.copyright}>{siteConfig.copyright}</p>
      </div>
    </footer>
  );
};

export default Footer;
