// Places an order from shared test data and verifies that the generated order appears in history.
const { test, expect } = require('@playwright/test');
const orderData = require('../../test-utilities/shared/placeOrder.json').find(({ productName }) => productName === 'ZARA COAT 3');

test('Ecommerce end-to-end flow from login to order confirmation', async ({ page }) => {
  if (!orderData) {
    throw new Error('ZARA COAT 3 order test data is missing.');
  }
  const { userName: email, passWord: password, productName, cardNumber, cvv, country } = orderData;

  await page.goto('https://rahulshettyacademy.com/client/#/auth/login');
  await page.locator('#userEmail').fill(email);
  await page.locator('#userPassword').fill(password);
  await page.locator('#login').click();

  await expect(page.locator('.card-body').first()).toBeVisible({ timeout: 30000 });

  const product = page.locator('.card-body').filter({ hasText: productName }).first();
  await expect(product).toBeVisible();
  await product.getByRole('button', { name: 'Add To Cart' }).click();

  await page.locator("[routerlink*='cart']").click();
  await expect(page.locator('h3').filter({ hasText: productName })).toBeVisible({ timeout: 20000 });

  await page.getByRole('button', { name: 'Checkout' }).click();
  await page.locator("[placeholder*='Country']").pressSequentially(country.slice(0, 3), { delay: 1000 });

  const options = page.locator('.ta-results');
  await options.waitFor();
  const countryButtons = options.locator('button');
  const countryLabels = await countryButtons.allTextContents();
  const countryIndex = countryLabels.findIndex((label) => label.trim() === country);
  if (countryIndex === -1) {
    throw new Error(`Country option "${country}" was not found.`);
  }
  await countryButtons.nth(countryIndex).click();

  await page.locator('.input.txt.text-validated').first().fill(cardNumber);
  await page.locator("//div[@class='payment__cc']//div[2]//input[1]").fill(cvv);
  await page.locator('.btnn').click();

  await expect(page.getByText(/Order Placed Successfully/i)).toBeVisible({ timeout: 60000 });
  const orderId = (await page.locator('label.ng-star-inserted').textContent())?.trim();
  expect(orderId).toBeTruthy();

  await page.locator("button[routerlink*='myorders']").click();
  await expect(page.locator('tbody')).toBeVisible({ timeout: 20000 });

  const rows = page.locator('tbody tr');
  const rowCount = await rows.count();
  let orderSeen = false;

  for (let i = 0; i < rowCount; i++) {
    const rowOrderId = await rows.nth(i).locator('th').textContent();
    if (orderId && rowOrderId && orderId.includes(rowOrderId)) {
      orderSeen = true;
      break;
    }
  }

  expect(orderSeen).toBeTruthy();
});
