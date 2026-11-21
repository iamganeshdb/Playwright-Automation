// @ts-check
const { defineConfig } = require('@playwright/test');

const config = defineConfig({
  timeout: 40 * 1000,
  expect: {
    timeout: 4000,
  },
  reporter: 'html',
  use: {
    browserName: 'chromium',
    headless: false,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    launchOptions: {
      args: ['--disable-blink-features=AutomationControlled'],
    },
  },
  projects: [
    {
      name: 'javascript',
      testDir: './tests/javascript',
      testMatch: '**/*.spec.js',
    },
    {
      name: 'typescript',
      testDir: './tests/typescript',
      testMatch: '**/*.spec.ts',
    },
  ],
  workers: 1,
});

module.exports = config;
