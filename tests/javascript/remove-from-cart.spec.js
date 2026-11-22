// Removes a product from the cart and verifies the empty state.
const { expect, test } = require('@playwright/test');
const { addToCart, login } = require('../../test-utilities/javascript/ecommerce-test-helpers');

test('removes a product from the cart', async ({ page }) => {
  await login(page);
  await addToCart(page);
  await page.locator("[routerlink*='cart']").click();
  await expect(page.getByText('ZARA COAT 3', { exact: true })).toBeVisible();

  await page.locator('button.btn-danger').click();

  await expect(page.getByText('No Products in Your Cart !', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Checkout' })).toHaveCount(0);
});
