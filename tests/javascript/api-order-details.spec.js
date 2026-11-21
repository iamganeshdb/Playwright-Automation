// Creates an order through the API, then verifies its details in the authenticated orders UI.
const { expect, request, test } = require('@playwright/test');
const { APIUtils } = require('../../test-utilities/javascript/APIUtils');
const loginPayload = { userEmail: 'anshika@gmail.com', userPassword: 'Iamking@000' };
const orderPayload = { orders: [{ country: 'Afghanistan', productOrderedId: '6960eae1c941646b7a8b3ed3' }] };

let response;

test.beforeAll(async () => {
  const apiContext = await request.newContext();
  try {
    response = await new APIUtils(apiContext, loginPayload).createOrder(orderPayload);
  } finally {
    await apiContext.dispose();
  }
});

test('verifies details for an API-created order', async ({ page }) => {
  await page.addInitScript((token) => {
    window.localStorage.setItem('token', token);
  }, response.token);

  await page.goto('https://rahulshettyacademy.com/client/');
  await page.locator("button[routerlink*='myorders']").click();
  const rows = page.locator('tbody tr');
  await expect(rows.first()).toBeVisible();

  for (let index = 0; index < await rows.count(); index++) {
    const rowOrderId = (await rows.nth(index).locator('th').textContent())?.trim();
    if (rowOrderId && response.orderId.includes(rowOrderId)) {
      await rows.nth(index).locator('button').first().click();
      break;
    }
  }

  await expect(page.locator('.col-text')).toContainText(response.orderId);
});

