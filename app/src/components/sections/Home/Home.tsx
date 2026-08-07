import type { Component } from 'solid-js';
import { A } from '@solidjs/router';

import EventList from './EventList';

const Home: Component = () => {
  return (
    <section id="home" class="section">
      <div class="container">
        <h1>Welcome to Stanislaus Humanists!</h1>
        <p>
          So what is Humanism anyway? In a nutshell, Humanism is a worldview which
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
      <EventList />
    </section>
  );
};

export default Home;
