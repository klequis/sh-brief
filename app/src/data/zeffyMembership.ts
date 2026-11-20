// The Zeffy membership form the Membership section points at. Values come
// from the campaign's Share dialog in the Zeffy dashboard ("Stanislaus
// Humanists Membership", a membership form with two rates: Individual
// Membership $24 and Family Membership $36).
//
// The form is live: joining through it charges a real card.
export const zeffyMembership = {
  campaignTitle: 'Stanislaus Humanists Membership',
  /** Public membership form. The QR code below points here too. */
  membershipFormUrl: 'https://www.zeffy.com/ticketing/stanislaus-humanists-membership',
  /** PNG served by Zeffy, ready to print. */
  qrCodeImageUrl:
    'https://api.zeffy.com/share-kit/d2c2dd27-f178-4486-90c4-cd32fb0b535c/qr-code.png',
};
