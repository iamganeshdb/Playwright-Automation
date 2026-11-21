// Checks that checkout shows the selected product and payment controls.
import { expect, test } from '@playwright/test';
import { addToCart, login } from './ecommerce-test-helpers';

test('opens checkout with the order summary and payment fields', async ({ page }) => {
  await login(page);
  await addToCart(page);
  await page.locator("[routerlink*='cart']").click();
  await page.getByRole('button', { name: 'Checkout' }).click();

  await expect(page.getByText('ZARA COAT 3', { exact: true })).toBeVisible();
  await expect(page.locator('.input.txt.text-validated').first()).toBeVisible();
  await expect(page.locator('input[placeholder="Select Country"]')).toBeVisible();
});
