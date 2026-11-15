// The Zeffy campaign the Donate section points at. All values are copied from
// the campaign's Share dialog in the Zeffy dashboard. "Text Campaign" is the
// organization's test campaign; swap these values when the real one exists.
//
// The form is live: a gift through it charges a real card.
export const zeffyCampaign = {
  campaignTitle: 'Text Campaign',
  /** Public donation page. The QR code below points here too. */
  donationFormUrl: 'https://www.zeffy.com/donation-form/text-campaign',
  /** PNG served by Zeffy, ready to print. */
  qrCodeImageUrl:
    'https://api.zeffy.com/share-kit/e4eec091-32f9-477d-af20-47421ed4c53a/qr-code.png',
};
