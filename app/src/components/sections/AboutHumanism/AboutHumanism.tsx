import type { Component } from 'solid-js';

import Science from './Science';
import Ethics from './Ethics';
import Society from './Society';
import Faqs from './Faqs';

const AboutHumanism: Component = () => {
  return (
    <section id="about-humanism" class="section">
      <div class="container">
        <h2>About Humanism</h2>
        <p>
          Humanism is a progressive philosophy of life that, without
          supernaturalism, affirms our ability and responsibility to lead ethical
          lives capable of adding to the greater good of humanity. Our values evolve
          as knowledge advances, drawing from the American Humanist Association's
          foundational document, "Humanism and Its Aspirations."
        </p>
        <Science />
        <Ethics />
        <Society />
        <Faqs />
      </div>
    </section>
  );
};

export default AboutHumanism;
