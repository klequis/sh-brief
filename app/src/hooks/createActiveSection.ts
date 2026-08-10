import { createSignal, onCleanup, onMount } from 'solid-js';

/**
 * Scroll-spy for the one-page layout: reports which section the reader is
 * currently in so the header nav can double as a "you are here" indicator.
 *
 * `ids` must list the section element ids in the order they appear in the
 * document — the sweep below takes the last section whose top has passed under
 * the header, which only holds for a top-to-bottom list.
 *
 * This watches scroll position rather than using IntersectionObserver on
 * purpose. The trailing section (#contact) is only a few lines tall, so any
 * observer band wide enough to feel right for the long sections is one the
 * short one can never fill, and the nav would stall on #membership for the
 * whole bottom of the page.
 */
export function createActiveSection(ids: readonly string[]) {
  const [activeId, setActiveId] = createSignal(ids[0]);

  onMount(() => {
    let frame = 0;

    const update = () => {
      frame = 0;

      // Once the page bottom is reached nothing further can scroll under the
      // header, so the last section is the one being read wherever its top
      // happens to sit. Without this the final short section never activates.
      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2;
      if (atBottom) {
        setActiveId(ids[ids.length - 1]);
        return;
      }

      // Measured rather than read from --header-height so the two can't drift:
      // the header is taller on narrow screens, where it stacks into two rows.
      const headerHeight =
        document.querySelector('header')?.getBoundingClientRect().height ?? 0;

      let current = ids[0];
      for (const id of ids) {
        const top = document.getElementById(id)?.getBoundingClientRect().top;
        // The 1px of slack absorbs sub-pixel rounding after a nav click, which
        // lands the section top a fraction below the header's bottom edge.
        if (top !== undefined && top <= headerHeight + 1) current = id;
      }
      setActiveId(current);
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });

    onCleanup(() => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    });
  });

  return activeId;
}
