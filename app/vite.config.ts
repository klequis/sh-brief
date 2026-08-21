import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import devtools from 'solid-devtools/vite';

export default defineConfig(({ command }) => ({
  // Relative asset paths, so the same build works wherever it's mounted. The
  // site serves at the root of https://stanislaus-humanists.org, so './' isn't
  // strictly required there, but it keeps `pnpm serve` and any preview URL
  // working from a subpath too.
  // Safe here because the app uses HashRouter — the document path never
  // changes, only the fragment, so "./" always resolves against the same base.
  // Switching to BrowserRouter would break this: deep paths change what "./"
  // resolves against, so base would have to become '/'. See doc/custom-domain.md.
  base: './',
  // hydratable: true is required because this app prerenders itself.
  // vite-plugin-solid defaults it to false, which compiles templates that build
  // fresh DOM and never look for the server's data-hk markers. hydrate() then
  // adopts nothing: the prerendered HTML stays on screen, no event handler is
  // attached, and nothing throws. The page looks correct and is completely
  // inert -- which went unnoticed while the site had nothing to click.
  // scripts/prerender.mjs compiles the matching SSR half with ssr: true.
  //
  // devtools is gated to `vite dev` for the same reason the two halves must
  // agree: it runs its own Babel transform, and the prerender build (which uses
  // configFile: false) never sees it.
  plugins: [
    ...(command === 'serve' ? [devtools()] : []),
    solidPlugin({ solid: { hydratable: true } }),
  ],
  server: {
    port: 3000,
  },
  build: {
    target: 'esnext',
  },
}));
