import type { Component } from 'solid-js';
import { A } from '@solidjs/router';

import { createUpcomingEvents } from '../../../hooks/createUpcomingEvents';
import EventList from './EventList';
import Hero from './Hero';

const Home: Component = () => {
  const upcomingEvents = createUpcomingEvents();

  return (
    <section id="home" class="section section--hero">
      <Hero nextEvent={upcomingEvents.events()[0]} />
      <div class="section__body">
        <div class="container">
          <h2>What is Humanism?</h2>
          <p>
            In a nutshell, Humanism is a worldview which
            holds that reason and science are the best ways to understand the world
            around us, and that dignity and compassion should be the basis for how you
            act toward someone else. Humanism is naturalistic. We rely on our senses
            and the reasonable inferences we can draw from our experiences. We have
            come to the conclusion that there is no credible evidence or argument for
            the existence of God, the supernatural, or an afterlife. We are living the
            only life we'll have in the only world we know about. The responsibility
            for the choices we make is ours and ours alone. Visit the{' '}
            <A href="/about-humanism" noScroll>
              About Humanism
            </A>{' '}
            page to learn more.
          </p>
        </div>
        <EventList events={upcomingEvents.events()} loading={upcomingEvents.loading()} />
      </div>
    </section>
  );
};

export default Home;
