// Adds a product to the cart from its detail page.
const { expect, test } = require('@playwright/test');
const { login } = require('./ecommerce-test-helpers');

test('adds a product to the cart from its detail page', async ({ page }) => {
  await login(page);

  await page.locator('.card-body').filter({ hasText: 'ZARA COAT 3' })
    .getByRole('button', { name: 'View' }).click();
  await expect(page.getByText('ZARA COAT 3', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Add To Cart' }).click();
  await page.locator("[routerlink*='cart']").click();

  await expect(page.getByText('ZARA COAT 3', { exact: true })).toBeVisible();
});
