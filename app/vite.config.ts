import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import devtools from 'solid-devtools/vite';

export default defineConfig({
  // Relative asset paths, so the same build works wherever it's mounted. The
  // site serves at the root of https://stanislaus-humanists.org, so './' isn't
  // strictly required there, but it keeps `pnpm serve` and any preview URL
  // working from a subpath too.
  // Safe here because the site is one page: links only ever change the
  // "#section" part of the address, never the path, so "./" always resolves
  // against the same base. Giving sections their own paths (/membership, ...)
  // would break this — base would have to become '/'. See
  // sh-brief-doc/README.md.
  base: './',
  // ssr: true builds the browser code to hydrate the prerendered markup
  // (src/index.tsx calls hydrate()). Without it the page silently never
  // hydrates and live updates go to detached elements.
  plugins: [devtools(), solidPlugin({ ssr: true })],
  server: {
    port: 3000,
  },
  build: {
    target: 'esnext',
  },
});
