// Creates an order through the API, then verifies its details in the authenticated orders UI.
import { expect, request, test } from '@playwright/test';
import { ApiTestUtils, type CreatedOrder } from './api-test-utils';

const loginPayload = {
  userEmail: 'anshika@gmail.com',
  userPassword: 'Iamking@000',
};
const orderPayload = {
  orders: [{ country: 'Afghanistan', productOrderedId: '6960eae1c941646b7a8b3ed3' }],
};

let createdOrder: CreatedOrder;

test.beforeAll(async () => {
  const apiContext = await request.newContext();
  try {
    createdOrder = await new ApiTestUtils(apiContext, loginPayload).createOrder(orderPayload);
  } finally {
    await apiContext.dispose();
  }
});

test('verifies details for an API-created order', async ({ page }) => {
  await page.addInitScript((token: string) => {
    window.localStorage.setItem('token', token);
  }, createdOrder.token);

  await page.goto('https://rahulshettyacademy.com/client/');
  await page.locator("button[routerlink*='myorders']").click();

  const orderRow = page.locator('tbody tr').filter({ hasText: createdOrder.orderId });
  await expect(orderRow).toBeVisible();
  await orderRow.getByRole('button').first().click();
  await expect(page.locator('.col-text')).toContainText(createdOrder.orderId);
});
