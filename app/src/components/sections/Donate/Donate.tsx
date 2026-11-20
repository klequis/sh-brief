import type { Component } from 'solid-js';

import { zeffyCampaign } from '../../../data/zeffyCampaign';
import ZeffyLinkAndQrCode from '../../ui/ZeffyLinkAndQrCode/ZeffyLinkAndQrCode';
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
        <ZeffyLinkAndQrCode
          formUrl={zeffyCampaign.donationFormUrl}
          qrCodeImageUrl={zeffyCampaign.qrCodeImageUrl}
          buttonLabel="Donate on Zeffy"
          qrCodeAlt="QR code that opens our Zeffy donation page"
          handledByZeffy="Donations"
        />
      </div>
    </section>
  );
};

export default Donate;
