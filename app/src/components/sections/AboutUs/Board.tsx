import type { Component } from 'solid-js';
import { For } from 'solid-js';

import { boardChairMessage, boardMembers } from '../../../data/board';

const Board: Component = () => {
  return (
    <div id="board">
      <h3>Our Board</h3>
      <p>
        Directors are elected each January and serve a three year term. All
        dues-paying members are eligible to vote for new board members.
      </p>
      <blockquote>
        <p>{boardChairMessage.message}</p>
        <footer>
          — {boardChairMessage.author}, {boardChairMessage.role} (since{' '}
          {boardChairMessage.since})
        </footer>
      </blockquote>
      <h4>Board of Directors</h4>
      <ul>
        <For each={boardMembers}>
          {(member) => (
            <li>
              {member.name}
              {member.role ? ` (${member.role})` : ''}
            </li>
          )}
        </For>
      </ul>
    </div>
  );
};

export default Board;
