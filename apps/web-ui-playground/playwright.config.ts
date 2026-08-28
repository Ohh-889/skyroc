import { fileURLToPath } from 'node:url';
import { defineConfig, devices } from '@playwright/test';

const PLAYGROUND_DIR = fileURLToPath(new URL('.', import.meta.url));
const PORT = Number(process.env.PLAYWRIGHT_PORT ?? 3100);
const BASE_URL = `http://127.0.0.1:${PORT}`;
const LOCALE = process.env.PLAYWRIGHT_LOCALE ?? 'zh';
const WORKERS = Number(process.env.PLAYWRIGHT_WORKERS ?? 1);

export default defineConfig({
  testDir: './e2e',
  timeout: 30_000,
  expect: {
    timeout: 8_000
  },
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: WORKERS,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry'
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ],
  webServer: {
    command: `pnpm run predev && pnpm exec next dev --turbopack --hostname 127.0.0.1 --port ${PORT}`,
    cwd: PLAYGROUND_DIR,
    url: `${BASE_URL}/${LOCALE}/accordion`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000
  }
});
