// Verifies failed checkout requests show feedback without creating a real order.
const { expect, test } = require('@playwright/test');
const { addToCart, login, selectCountry } = require('./ecommerce-test-helpers');

test('shows an error when invalid checkout data is rejected', async ({ page }) => {
  let interceptedOrderRequest = false;
  await page.route('**/api/ecom/order/create-order', async (route) => {
    interceptedOrderRequest = true;
    await route.abort();
  });

  await login(page);
  await addToCart(page);
  await page.locator("[routerlink*='cart']").click();
  await page.getByRole('button', { name: 'Checkout' }).click();
  await page.locator('.input.txt.text-validated').first().fill('123');
  await page.locator("//div[@class='payment__cc']//div[2]//input[1]").fill('invalid');
  await selectCountry(page, 'India');
  await page.locator('.btnn').click();

  await expect(page.getByText('Unknown error occured', { exact: true })).toBeVisible();
  expect(interceptedOrderRequest).toBe(true);
  await expect(page.getByText(/Order Placed Successfully/i)).toHaveCount(0);
});
