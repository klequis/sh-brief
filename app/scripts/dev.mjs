// `pnpm dev`: starts the page (Vite, `pnpm dev:page`) and the Worker that
// serves /api/events and /api/donation-progress (`pnpm dev:api`) in one
// terminal. Vite forwards /api to the Worker; see vite.config.ts.
//
// Ctrl+C stops both, and if either one exits, the other is stopped too, so
// you never end up with a page whose API is silently gone.
import { spawn } from 'node:child_process';

const devServers = [
  { label: 'page', script: 'dev:page' },
  { label: 'api', script: 'dev:api' },
];

const running = devServers.map(({ label, script }) => {
  const child = spawn('pnpm', ['run', '--silent', script], {
    stdio: ['inherit', 'pipe', 'pipe'],
  });
  const prefixLines = (chunk) =>
    chunk
      .toString()
      .split('\n')
      .filter((line) => line.length > 0)
      .map((line) => `[${label}] ${line}\n`)
      .join('');
  child.stdout.on('data', (chunk) => process.stdout.write(prefixLines(chunk)));
  child.stderr.on('data', (chunk) => process.stderr.write(prefixLines(chunk)));
  child.on('exit', (code) => {
    console.log(`[${label}] stopped${code ? ` (exit code ${code})` : ''}`);
    stopAll(code ?? 0);
  });
  return child;
});

let stopping = false;
function stopAll(exitCode) {
  if (stopping) return;
  stopping = true;
  for (const child of running) if (child.exitCode === null) child.kill('SIGTERM');
  setTimeout(() => process.exit(exitCode), 500);
}

process.on('SIGINT', () => stopAll(0));
process.on('SIGTERM', () => stopAll(0));
