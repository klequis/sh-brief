export interface BoardMember {
  name: string;
  role?: string;
}

export const boardChairMessage = {
  author: 'Freedom Baerheim',
  role: 'Board Chair',
  since: 'January 2023',
  message: `I'm so happy you're here! We believe in people, in being a part of our
community, and in making new connections. We welcome new perspectives and embrace
diversity. Please explore the site, especially the About Humanism pages because
that's where we lay out what drives and motivates us. If you have any questions
about Humanism, you're welcome to ask me or any other Board Member. If you're ready
to jump in and become a member, we'll welcome you with open arms. We would also
love to meet with you, so be sure to check out the Events page. Register for one
of our upcoming events and come introduce yourself!`,
};

export const boardMembers: BoardMember[] = [
  { name: 'Frank Brown' },
  { name: 'John Schattenburg' },
  { name: 'Carl Becker' },
  { name: 'Brandilyn Mitchell' },
  { name: 'Lorraine Nilson' },
  { name: 'Freedom Baerheim', role: 'Chair' },
  { name: 'Todd Lamb' },
  { name: 'Anton Boyadjian' },
];
