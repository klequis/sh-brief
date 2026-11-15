import type { Component } from 'solid-js';

import { zeffyCampaign } from '../../../data/zeffyCampaign';
import styles from './Donate.module.css';
import DonationProgress from './DonationProgress';

// Integration 1: a plain link to the Zeffy donation page, plus its QR code for
// flyers and the sign-in table.
// Integration 3: live progress toward the campaign's goal above them.
const Donate: Component = () => {
  return (
    <section id="donate" class="section">
      <div class="container">
        <h2>Donate</h2>
        <p>
          Stanislaus Humanists runs on its members and donors. Gifts pay for meeting
          space, events and outreach in the Central Valley.
        </p>
        <DonationProgress />
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
          Donations are handled by Zeffy, which opens in a new tab. Zeffy is free for
          us; at checkout it asks you for an optional tip to Zeffy, which you can set
          to $0.
        </p>
      </div>
    </section>
  );
};

export default Donate;
