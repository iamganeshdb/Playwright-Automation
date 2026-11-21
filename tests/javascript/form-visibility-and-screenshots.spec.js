// Exercises the practice page's visibility, dialog, and hover controls, then captures screenshots.
const { expect, test } = require('@playwright/test');

test('shows and hides the practice text field', async ({ page }) => {
  await page.goto('https://rahulshettyacademy.com/Automationpractice/');
  await expect(page.locator('#displayed-text')).toBeVisible();
  await page.locator('#hide-textbox').click();
  await expect(page.locator('#displayed-text')).toBeHidden();

  page.once('dialog', (dialog) => dialog.accept());
  await page.locator('#confirmbtn').click();
  await page.locator('#mousehover').hover();
});

test('captures the practice field and page screenshots', async ({ page }) => {
  await page.goto('https://rahulshettyacademy.com/Automationpractice/');
  const textField = page.locator('#displayed-text');
  await expect(textField).toBeVisible();
  await textField.screenshot({ path: 'DisplayedText.png', animations: 'disabled', timeout: 5000 });
  await page.locator('#hide-textbox').click();
  await page.screenshot({ path: 'Screenshot.png' });
});
