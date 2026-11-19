import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import devtools from 'solid-devtools/vite';

export default defineConfig({
  // Relative asset paths, so the same build works wherever it's mounted. The
  // site serves at the root of https://stanislaus-humanists.org, so './' isn't
  // strictly required there, but it keeps `pnpm serve` and any preview URL
  // working from a subpath too.
  // Safe here because the app uses HashRouter — the document path never
  // changes, only the fragment, so "./" always resolves against the same base.
  // Switching to BrowserRouter would break this: deep paths change what "./"
  // resolves against, so base would have to become '/'. See doc/custom-domain.md.
  base: './',
  plugins: [devtools(), solidPlugin()],
  server: {
    port: 3000,
  },
  build: {
    target: 'esnext',
  },
});
