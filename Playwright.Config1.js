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
// @ts-ignore
const config=defineConfig({
  testDir: './tests',
  retries:1,
timeout: 400 * 100,//every step
expect:{
  timeout: 4000,
},
reporter: 'html',
projects:[
  {
    name:'Safari',
    use: {
    browserName:'webkit',
    headless : false,
    screenshot:'on',
   video:'retain-on-failure',
    trace: 'on',
    ignoreHTTPSErrors:true,
    permissions:['geolocation'],
    //viewport:{width: 720, height:720},
    ...devices['iPhone 15 Pro'],

  }
},
{
    name:'Chrome',
    use: {
    browserName:'chromium',
    headless : false,
    screenshot:'on',
    trace: 'on',
    video:'retain-on-failure',
    // launchOptions: {
    //   args: ['--disable-blink-features=AutomationControlled'],
    //      }
  }
}
]



  
    /* Base URL to use in actions like `await page.goto('')`. */
    // baseURL: 'http://localhost:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    
  
});
module.exports=config;

   
