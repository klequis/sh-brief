import type { Component } from 'solid-js';

import { siteConfig } from '../../data/site';

const SocialLinks: Component<{ class?: string }> = (props) => {
  return (
    <div class={props.class}>
      <a href={siteConfig.social.facebook} target="_blank" rel="noopener noreferrer">
        Facebook
      </a>
      {' | '}
      <a href={siteConfig.social.meetup} target="_blank" rel="noopener noreferrer">
        Meetup
      </a>
      {' | '}
      <a href={siteConfig.social.youtube} target="_blank" rel="noopener noreferrer">
        YouTube
      </a>
    </div>
  );
};

export default SocialLinks;
