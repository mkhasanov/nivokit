import { defineConfig } from '@playwright/test'

const externalBaseUrl = process.env.PLAYWRIGHT_BASE_URL
const baseURL = externalBaseUrl || 'http://127.0.0.1:4173'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: true,
  retries: 0,
  reporter: 'line',
  use: {
    baseURL,
    headless: true,
    launchOptions: {
      executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || '/usr/bin/chromium',
      args: ['--no-sandbox'],
    },
  },
  webServer: externalBaseUrl
    ? undefined
    : {
        command: 'pnpm dev --host 127.0.0.1 --port 4173',
        url: 'http://127.0.0.1:4173/en/',
        timeout: 30_000,
        reuseExistingServer: false,
        env: {
          NUXT_TELEMETRY_DISABLED: '1',
        },
      },
})
