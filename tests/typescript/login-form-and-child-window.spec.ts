// Checks practice login form controls and reads contact information from a child window.
import { expect, test } from '@playwright/test';

test('validates the practice login form controls', async ({ page }) => {
  await page.goto('https://rahulshettyacademy.com/loginpagePractise/');
  await page.locator('#username').fill('rahulshettyacademy');
  await page.locator('#password').fill('Learning@830$3mK2');
  await page.locator('select.form-control').selectOption('stud');
  await page.locator('.radiotextsty').last().click();
  await page.locator('#okayBtn').click();
  await expect(page.locator('.radiotextsty').last()).toBeChecked();
  await page.locator('#terms').check();
  await page.locator('#terms').uncheck();
  await page.locator('#terms').check();
  await expect(page.locator('#terms')).toBeChecked();
  await expect(page.locator('[href*=documents-request]')).toHaveAttribute('class', 'blinkingText');
});

test('reads contact details from the child window', async ({ browser }) => {
  const context = await browser.newContext();
  try {
    const page = await context.newPage();
    await page.goto('https://rahulshettyacademy.com/loginpagePractise/');
    const [childPage] = await Promise.all([
      context.waitForEvent('page'),
      page.locator('[href*=documents-request]').click(),
    ]);

    const contactText = await childPage.locator('.red').textContent();
    if (!contactText) {
      throw new Error('The child window did not contain contact information.');
    }
    const username = contactText.split('@')[1]?.split(' ')[0];
    if (!username) {
      throw new Error('Could not extract a username from the child-window contact.');
    }

    await page.locator('#username').fill(username);
    await expect(page.locator('#username')).toHaveValue(username);
  } finally {
    await context.close();
  }
});
