## Usage

Those templates dependencies are maintained via [pnpm](https://pnpm.io) via `pnpm up -Lri`.

This is the reason you see a `pnpm-lock.yaml`. That being said, any package manager will work. This file can be safely be removed once you clone a template.

```bash
$ npm install # or pnpm install or yarn install
```

### Learn more on the [Solid Website](https://solidjs.com) and come chat with us on our [Discord](https://discord.com/invite/solidjs)

## Available Scripts

In the project directory, you can run:

### `pnpm dev` or `pnpm start`

Runs the app in the development mode: the page (Vite, `pnpm dev:page`) and the
Worker that serves `/api/events` and `/api/donation-progress` (`pnpm dev:api`),
together in one terminal (see `scripts/dev.mjs`). Ctrl+C stops both.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>

### `pnpm dev:api`

The Worker alone, on port 8787; `pnpm dev` starts it for you. Vite forwards
`/api` to it. Without it, the Donate section says "Live totals are unavailable right now" and
the event list falls back to its built-in snapshot. It reads `ZEFFY_API_KEY`
from `app/.dev.vars`.

### `npm run build`

Builds the app for production to the `dist` folder.<br>
It correctly bundles Solid in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

## Deployment

You can deploy the `dist` folder to any static host provider (netlify, surge, now, etc.)

## This project was created with the [Solid CLI](https://github.com/solidjs-community/solid-cli)
