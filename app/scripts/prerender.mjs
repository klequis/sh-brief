/**
 * Prerenders the app to static HTML and injects it into the built index.html.
 *
 * Run after `vite build`. The client build emits a dist/index.html whose #root
 * is empty, so the served document contains none of the page copy — bad for
 * search engines, and worse for link unfurlers (Facebook, Meetup, Slack), which
 * never execute JavaScript at all. This bakes the rendered markup in.
 *
 * Two builds are involved because Solid compiles JSX differently per target:
 * the client build produces DOM-building code, while the SSR build compiles the
 * same components into string concatenation and resolves solid-js/web to its
 * server entry. Only the client build's output ships; this one is scratch.
 */
import { readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { build } from 'vite';
import solidPlugin from 'vite-plugin-solid';

const appRoot = path.resolve(fileURLToPath(new URL('.', import.meta.url)), '..');
const ssrOutDir = path.join(appRoot, '.prerender');
const ssrEntryName = 'entry-prerender.mjs';
const indexPath = path.join(appRoot, 'dist', 'index.html');

const HEAD_MARKER = '<!--app-head-->';
const HTML_MARKER = '<!--app-html-->';

// configFile: false so this build doesn't inherit the client config's base or
// the solid-devtools plugin, neither of which means anything server-side.
// CSS module class names are left at Vite's default in both builds so the two
// agree — a divergence here would surface as hydration mismatch, not an error.
await build({
  configFile: false,
  root: appRoot,
  logLevel: 'warn',
  plugins: [solidPlugin({ ssr: true })],
  resolve: {
    // "solid" picks each package's uncompiled JSX so this build's SSR transform
    // applies to it; "node" resolves solid-js/web to its server entry.
    conditions: ['solid', 'node'],
  },
  ssr: {
    // Must be compiled by the plugin above rather than left to Node, which
    // would load the browser-targeted dist and reach for document.
    noExternal: ['solid-js', '@solidjs/router'],
  },
  build: {
    ssr: path.join(appRoot, 'src', 'entry-prerender.tsx'),
    outDir: ssrOutDir,
    target: 'esnext',
    emptyOutDir: true,
    minify: false,
    rollupOptions: { output: { entryFileNames: ssrEntryName } },
  },
});

try {
  const { renderPage } = await import(
    pathToFileURL(path.join(ssrOutDir, ssrEntryName)).href
  );
  const { html, head } = renderPage();

  if (!html.trim()) {
    throw new Error('Prerender produced empty markup.');
  }

  const doc = await readFile(indexPath, 'utf8');
  if (!doc.includes(HTML_MARKER) || !doc.includes(HEAD_MARKER)) {
    // Failing loudly matters: a silently un-injected build ships an empty #root,
    // and the browser entry hydrates against nothing, leaving a blank page.
    throw new Error(
      `index.html is missing ${HEAD_MARKER} or ${HTML_MARKER} — cannot inject prerendered output.`,
    );
  }

  await writeFile(
    indexPath,
    doc.replace(HEAD_MARKER, head).replace(HTML_MARKER, html),
  );

  console.log(`prerender: injected ${html.length} bytes into dist/index.html`);
} finally {
  await rm(ssrOutDir, { recursive: true, force: true });
}
