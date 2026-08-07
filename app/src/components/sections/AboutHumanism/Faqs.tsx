import type { Component } from 'solid-js';
import { For } from 'solid-js';

import { faqs } from '../../../data/faqs';

const Faqs: Component = () => {
  return (
    <div id="faqs">
      <h3>FAQs</h3>
      <For each={faqs}>
        {(faq) => (
          <details>
            <summary>{faq.question}</summary>
            <p>{faq.answer}</p>
          </details>
        )}
      </For>
    </div>
  );
};

export default Faqs;
