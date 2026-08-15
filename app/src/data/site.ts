export interface MailingAddress {
  poBox: string;
  city: string;
  /** Two-letter state code, e.g. 'CA'. */
  region: string;
  postalCode: string;
}

export const siteConfig = {
  orgName: 'Stanislaus Humanists',
  // Canonical origin, no trailing slash. Structured data needs absolute URLs,
  // and the canonical/Open Graph tags will need this too.
  url: 'https://stanislaus-humanists.org',
  tagline: 'science | art | compassion',
  email: 'info@StanislausHumanists.org',
  // Kept as parts rather than one string so the JSON-LD PostalAddress and the
  // text on the Contact section can't drift apart. formatMailingAddress()
  // renders the display form.
  mailingAddress: {
    poBox: '4476',
    city: 'Modesto',
    region: 'CA',
    postalCode: '95352',
  } satisfies MailingAddress,
  founded: '2012',
  // Where members actually come from — the group is based in Modesto but is not
  // limited to Stanislaus County. Emitted as areaServed in the JSON-LD.
  areaServed: [
    'Stanislaus County, California',
    'San Joaquin County, California',
    'Merced County, California',
    'Tuolumne County, California',
    'Calaveras County, California',
  ],
  // Chapter of the American Humanist Association since November 20, 2013.
  parentOrg: {
    name: 'American Humanist Association',
    url: 'https://americanhumanist.org',
  },
  social: {
    facebook: 'https://www.facebook.com/groups/humanisthall/',
    meetup: 'https://www.meetup.com/Stanislaus-Humanists/',
    youtube: 'https://www.youtube.com/channel/UCE3x-htbRsEdutGlt7kNzZg/',
  },
  copyright: '© Stanislaus Humanists Inc.',
};

export function formatMailingAddress(address: MailingAddress): string {
  return `PO Box ${address.poBox}, ${address.city}, ${address.region} ${address.postalCode}`;
}

// "id" is the id of the <section> the link scrolls to, which the scroll-spy in
// the header needs to map a scroll position back to a link. Keep this array in
// the same order the sections appear in Sections.tsx — createActiveSection
// walks it top to bottom.
export const navLinks = [
  { label: 'Home', href: '/', id: 'home' },
  { label: 'About Us', href: '/about-us', id: 'about-us' },
  { label: 'About Humanism', href: '/about-humanism', id: 'about-humanism' },
  { label: 'Membership', href: '/membership', id: 'membership' },
  { label: 'Contact', href: '/contact', id: 'contact' },
];
