import type { Component } from 'solid-js';

import { zeffyCampaign } from '../../../data/zeffyCampaign';
import styles from './Donate.module.css';
import ZeffyEmbed from './ZeffyEmbed';

// Integration 2: Zeffy's form embedded in the section, so donors give without
// leaving the site. Integration 1's link and QR code stay underneath it, for
// anyone who'd rather give on Zeffy's own page or from their phone, and as a
// way through if the embedded form doesn't load.
const Donate: Component = () => {
  return (
    <section id="donate" class="section">
      <div class="container">
        <h2>Donate</h2>
        <p>
          Stanislaus Humanists runs on its members and donors. Gifts pay for meeting
          space, events and outreach in the Central Valley.
        </p>
        <ZeffyEmbed />
        <p class={styles.otherWaysLead}>
          Prefer to give on Zeffy's own page, or from your phone?
        </p>
        <div class={styles.donateOptions}>
          <a
            class={styles.donateButton}
            href={zeffyCampaign.donationFormUrl}
            target="_blank"
            rel="noopener"
          >
            Donate on Zeffy
          </a>
          <figure class={styles.qrCode}>
            <img
              src={zeffyCampaign.qrCodeImageUrl}
              alt="QR code that opens our Zeffy donation page"
              width="160"
              height="160"
              loading="lazy"
            />
            <figcaption>Or scan with your phone's camera</figcaption>
          </figure>
        </div>
        <p class={styles.donateNote}>
          Donations are handled by Zeffy. The button opens it in a new tab. Zeffy is free for
          us; at checkout it asks you for an optional tip to Zeffy, which you can set
          to $0.
        </p>
      </div>
    </section>
  );
};

export default Donate;
