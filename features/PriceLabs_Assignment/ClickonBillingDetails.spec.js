const { test } = require('@playwright/test');


  let URL="https://app.pricelabs.co/pricing";
    let username="pricelabs.qa.test@gmail.com";
    let password="Pltest@2026";


test("SaveAuth", async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto(URL);
//   await page.getByPlaceholder('Email Address').fill(username);
//   await page.getByPlaceholder('Password').fill(password);
//   await page.locator('input[name="commit"]').click();
    await page.getByRole('button', { name: 'close' }).click();
    await page.getByText('Subscribe', { exact: true }).click();
  // Wait for full login to complete
  await page.waitForLoadState('networkidle');

  // Save cookies + localStorage
  await context.storageState({ path: 'auth.json' });
  await browser.close();
});

test.use({ storageState: 'auth.json' });

test.only("ClickonBillingDetails", async ({ page }) => {
    await page.goto(URL);
    await page.getByRole('button', { name: 'Dynamic Pricing' }).click();
     //await page.locator('input[name="commit"]').click();
    await page.getByRole('button', { name: 'close' }).click();
await page.getByText('Subscribe', { exact: true }).click();
//await page.locator('iframe[src="https://challenges.cloudflare.com/cdn-cgi/challenge-platform/h/g/turnstile/f/ov2/av0/rch/vzbqy/0x4AAAAAAADnPIDROrmt1Wwj/light/fbE/new/normal?lang=auto"]').contentFrame().locator('body').check();
await page.getByText('Billing Details', { exact: true }).click();
});




// test.only("ClickonBillingDetails", async ({ page }) => {
//     await page.goto(URL);
//     await page.getByPlaceholder('Email Address').fill(username);
//    await page.getByPlaceholder('Password').fill(password);
//     await page.locator('input[name="commit"]').click();
//     await page.getByRole('button', { name: 'close' }).click();
// await page.getByText('Subscribe', { exact: true }).click();
// //await page.locator('iframe[src="https://challenges.cloudflare.com/cdn-cgi/challenge-platform/h/g/turnstile/f/ov2/av0/rch/vzbqy/0x4AAAAAAADnPIDROrmt1Wwj/light/fbE/new/normal?lang=auto"]').contentFrame().locator('body').check();
// await page.getByText('Billing Details', { exact: true }).click();
// await page.pause();
// });