// @ts-check
import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * @see https://playwright.dev/docs/test-configuration
 */
const config=({
  testDir: './tests',
  testMatch: '**/*.spec.js',


timeout: 400 * 100,//every step
expect:{
  timeout: 4000,
},
reporter: 'html',




  use: {
    browserName:'chromium',
    headless : false,
    screenshot:'on',
    trace: 'on',
    launchOptions: {
      args: ['--disable-blink-features=AutomationControlled']//Reducing bot detection
    }
    /* Base URL to use in actions like `await page.goto('')`. */
    // baseURL: 'http://localhost:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    
  },
});
module.exports=config;

   
