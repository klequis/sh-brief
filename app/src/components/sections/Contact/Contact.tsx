import type { Component } from 'solid-js';

import { formatMailingAddress, siteConfig } from '../../../data/site';
import SocialLinks from '../../ui/SocialLinks';

const Contact: Component = () => {
  return (
    <section id="contact" class="section">
      <div class="container">
        <h2>Contact</h2>
        <p>{formatMailingAddress(siteConfig.mailingAddress)}</p>
        <p>
          <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
        </p>
        <SocialLinks />
      </div>
    </section>
  );
};

export default Contact;
