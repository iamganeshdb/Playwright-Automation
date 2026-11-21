// Checks that authentication, cart, checkout, and orders survive navigation and refresh.
const { expect, test } = require('@playwright/test');
const { addToCart, login, mockOrder, stubOrderHistory } = require('./ecommerce-test-helpers');

test('keeps the session consistent through refresh and navigation', async ({ page }) => {
  await stubOrderHistory(page);
  await login(page);
  await page.reload();
  await expect(page.locator('.card-body').first()).toBeVisible();

  await addToCart(page);
  await page.locator("[routerlink*='cart']").click();
  await expect(page.getByText('ZARA COAT 3', { exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByText('ZARA COAT 3', { exact: true })).toBeVisible();

  await page.getByRole('button', { name: 'Checkout' }).click();
  await expect(page.locator('input[placeholder="Select Country"]')).toBeVisible();
  await page.goto('https://rahulshettyacademy.com/client/#/dashboard/myorders');
  await expect(page.locator('tbody tr')).toContainText(mockOrder.productName);
});
