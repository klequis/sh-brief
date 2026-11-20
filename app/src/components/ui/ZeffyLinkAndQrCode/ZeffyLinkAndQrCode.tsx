import type { Component } from 'solid-js';

import styles from './ZeffyLinkAndQrCode.module.css';

// A button that opens a Zeffy form in a new tab, its QR code for flyers and
// the sign-in table, and the note about Zeffy's optional tip. Used by the
// Donate section (donation form) and the Membership section (membership form).
const ZeffyLinkAndQrCode: Component<{
  formUrl: string;
  qrCodeImageUrl: string;
  buttonLabel: string;
  /** Alt text for the QR code: what page it opens. */
  qrCodeAlt: string;
  /** What Zeffy handles, for the note: "Donations", "Memberships". */
  handledByZeffy: string;
}> = (props) => {
  return (
    <>
      <div class={styles.linkAndQrCode}>
        <a class={styles.zeffyButton} href={props.formUrl} target="_blank" rel="noopener">
          {props.buttonLabel}
        </a>
        <figure class={styles.qrCode}>
          <img
            src={props.qrCodeImageUrl}
            alt={props.qrCodeAlt}
            width="160"
            height="160"
            loading="lazy"
          />
          <figcaption>Or scan with your phone's camera</figcaption>
        </figure>
      </div>
      <p class={styles.zeffyNote}>
        {props.handledByZeffy} are handled by Zeffy, which opens in a new tab. Zeffy is
        free for us; at checkout it asks you for an optional tip to Zeffy, which you
        can set to $0.
      </p>
    </>
  );
};

export default ZeffyLinkAndQrCode;
