import type { Component } from 'solid-js';

import Mission from './Mission';
import History from './History';
import Board from './Board';

const AboutUs: Component = () => {
  return (
    <section id="about-us" class="section section--alt">
      <div class="container">
        <h2>About Us</h2>
        <Mission />
        <History />
        <Board />
      </div>
    </section>
  );
};

export default AboutUs;
