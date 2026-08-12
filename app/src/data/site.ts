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

// "id" is the id of the element the link scrolls to, which the scroll-spy in
// the header needs to map a scroll position back to a link. Keep this array in
// document order — createActiveSection walks it top to bottom.
//
// Usually that means the order of Sections.tsx, but "board" is a sub-section
// inside About Us rather than a section of its own, so its place here comes
// from where <Board /> sits within AboutUs.tsx: last, just before About
// Humanism starts. Moving it above <History /> there would have to be
// mirrored here or the "you are here" pill sticks on the wrong link.
export const navLinks = [
  { label: 'Home', href: '/', id: 'home' },
  { label: 'About Us', href: '/about-us', id: 'about-us' },
  { label: 'Our Board', href: '/board', id: 'board' },
  { label: 'About Humanism', href: '/about-humanism', id: 'about-humanism' },
  { label: 'Membership', href: '/membership', id: 'membership' },
  { label: 'Contact', href: '/contact', id: 'contact' },
];
