const { chromium } = require('rebrowser-playwright');

const URL      = "https://app.pricelabs.co/pricing";
const username = "pricelabs.qa.test@gmail.com";
const password = "Pltest@2026";

(async () => {
  const browser = await chromium.launch({ 
    headless: false,
    args: [
    '--disable-blink-features=AutomationControlled',
    '--no-sandbox',
    '--disable-web-security',
    '--disable-features=IsolateOrigins,site-per-process'
  ]
  });

  const context = await browser.newContext();
  const page    = await context.newPage();

  await page.addInitScript(() => {
  Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
  window.chrome = { runtime: {} };
});
  await page.goto(URL);
  await page.getByPlaceholder('Email Address').fill(username);
  await page.getByPlaceholder('Password').fill(password);
  await page.locator('input[name="commit"]').click();
  await page.getByRole('button', { name: 'close' }).click();
  await page.getByText('Subscribe', { exact: true }).click();       // ← added
  await page.getByText('Billing Details', { exact: true }).click();
  })();