// Checks product information on the catalog detail page.
const { expect, test } = require('@playwright/test');
const { login } = require('./ecommerce-test-helpers');

test('opens a product detail page with its name, price, and cart action', async ({ page }) => {
  await login(page);

  const product = page.locator('.card-body').filter({ hasText: 'ZARA COAT 3' });
  await product.getByRole('button', { name: 'View' }).click();

  await expect(page.getByText('ZARA COAT 3', { exact: true })).toBeVisible();
  await expect(page.getByText('$ 11500', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Add To Cart' })).toBeVisible();
});
