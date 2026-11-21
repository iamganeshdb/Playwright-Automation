// Submits the Angular practice form, checks its success message, and adds Nokia Edge to the cart.
import { expect, test } from '@playwright/test';

test('submits the practice form and adds a product to the cart', async ({ page }) => {
  await page.goto('https://rahulshettyacademy.com/angularpractice/');
  await page.getByLabel('Check me out if you Love IceCreams!').check();
  await page.getByLabel('Employed').click();
  await page.getByLabel('Gender').selectOption('Female');
  await page.getByPlaceholder('Password').fill('12345678');
  await page.getByRole('button', { name: 'Submit' }).click();

  await expect(page.getByText('Success! The Form has been submitted successfully!')).toBeVisible();
  await page.getByRole('link', { name: 'Shop' }).click();
  await page.locator('app-card')
    .filter({ hasText: 'Nokia Edge' })
    .getByRole('button', { name: 'Add' })
    .click();
});
