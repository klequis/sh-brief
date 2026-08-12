export const siteConfig = {
  orgName: 'Stanislaus Humanists',
  tagline: 'science | art | compassion',
  email: 'info@StanislausHumanists.org',
  mailingAddress: 'PO Box 4476, Modesto, CA 95352',
  social: {
    facebook: 'https://www.facebook.com/groups/humanisthall/',
    meetup: 'https://www.meetup.com/Stanislaus-Humanists/',
    youtube: 'https://www.youtube.com/channel/UCE3x-htbRsEdutGlt7kNzZg/',
  },
  copyright: '© Stanislaus Humanists Inc.',
};

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
