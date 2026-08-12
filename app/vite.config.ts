import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import devtools from 'solid-devtools/vite';

export default defineConfig({
  // Relative asset paths, so the same build works wherever it's mounted:
  // https://klequis.github.io/sh-brief/ today, and the root of a custom domain
  // later. Safe here because the app uses HashRouter — the document path never
  // changes, only the fragment, so "./" always resolves against the same base.
  base: './',
  plugins: [devtools(), solidPlugin()],
  server: {
    port: 3000,
  },
  build: {
    target: 'esnext',
  },
});
