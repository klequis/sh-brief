import type { Component } from 'solid-js';

import Home from '../components/sections/Home/Home';
import AboutUs from '../components/sections/AboutUs/AboutUs';
import AboutHumanism from '../components/sections/AboutHumanism/AboutHumanism';
import Membership from '../components/sections/Membership/Membership';
import Contact from '../components/sections/Contact/Contact';

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
