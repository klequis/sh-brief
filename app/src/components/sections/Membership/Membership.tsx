import type { Component } from 'solid-js';
import { For } from 'solid-js';
import { A } from '@solidjs/router';

import JoinForm from './JoinForm';

const principles = [
  { name: 'Knowledge', description: 'Understanding through observation and rational analysis.' },
  { name: 'Nature', description: 'Humans as part of natural evolutionary processes.' },
  { name: 'Ethics', description: 'Values grounded in human experience and needs.' },
  { name: 'Fulfillment', description: 'Personal satisfaction through service to ideals.' },
  { name: 'Relationships', description: 'Social connection as a source of meaning.' },
  { name: 'Service', description: 'Contributing to society enhances individual well-being.' },
  { name: 'Well-Being', description: 'Equality and diversity benefit communities and the environment.' },
];

const Membership: Component = () => {
  return (
    <section id="membership" class="section section--alt">
      <div class="container">
        <h2>Membership</h2>
        <ul>
          <li>Individual: $24 / year</li>
          <li>Couples: $36 / year</li>
        </ul>
        <p>
          Membership runs on a February 1 – January 31 cycle and is prorated for
          mid-year enrollment.
        </p>
        <p>
          Members may attend Board of Directors meetings, vote for Board members at
          the Annual Meeting, receive the latest issue of <em>Humanitas</em> (our
          newsletter), and access an exclusive discussion forum. Members may also
          serve on the Board.
        </p>
        <h3>Our Seven Core Principles</h3>
        <ul>
          <For each={principles}>
            {(p) => (
              <li>
                <strong>{p.name}</strong> — {p.description}
              </li>
            )}
          </For>
        </ul>
        <JoinForm />
        <p>
          Before joining, we encourage you to review the{' '}
          <A href="/about-humanism" noScroll>
            About Humanism
          </A>{' '}
          section.
        </p>
      </div>
    </section>
  );
};

export default Membership;
