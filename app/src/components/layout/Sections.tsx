import type { Component } from 'solid-js';

import Home from '../sections/Home/Home';
import AboutUs from '../sections/AboutUs/AboutUs';
import AboutHumanism from '../sections/AboutHumanism/AboutHumanism';
import Membership from '../sections/Membership/Membership';
import Contact from '../sections/Contact/Contact';

const Sections: Component = () => {
  return (
    <>
      <Home />
      <AboutUs />
      <AboutHumanism />
      <Membership />
      <Contact />
    </>
  );
};

export default Sections;
