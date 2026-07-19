const { test } = require('@playwright/test');

const URL      = "https://app.pricelabs.co/pricing";
const username = "pricelabs.qa.test@gmail.com";
const password = "Pltest@2026";


//On Multicalendar set a "Fixed" 400 for 4 days
test("Fixed 400 Price for 4 days", async ({ page }) => {
    await page.goto(URL);
    await page.getByPlaceholder('Email Address').fill(username);
    await page.getByPlaceholder('Password').fill(password);
    await page.locator('input[name="commit"]').click();
    await page.getByRole('button', { name: 'close' }).click();
    await page.getByRole('button', { name: 'Dynamic Pricing' }).click();
    await page.locator(':text-is("Multi Calendar")').click();
    // Open calendar
    await page.locator("th:nth-child(12) div:nth-child(1) p:nth-child(1)").click();
    await page.getByRole('dialog', { name: 'Date Specific Overrides Learn' }).locator('#date-picker    -calendar-start').click();
await page.getByLabel('Choose Tuesday, June 31st,').locator('div').filter({ hasText: /^16$/ }).click();
    await page.getByRole('dialog', { name: 'Date Specific Overrides Learn' }).locator('#date-picker-calendar-end').click();
    await page.getByRole('dialog', { name: 'Date Specific Overrides Learn' }).locator('#date-picker-calendar-end').click();
    await page.getByLabel('Choose Saturday, June 20th,').locator('div').filter({ hasText: /^20$/ }).click();
    await page.locator('#dso-modal-dso-price-mc').getByRole('textbox').fill('400');
    await page.getByRole('button', { name: 'Add' }).click();
    await page.getByRole('button', { name: 'Update' }).click();
    await page.pause();
});