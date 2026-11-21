// Stubs the orders API with an empty result and verifies the empty-history message and actions.
const { expect, request, test } = require('@playwright/test');
const { APIUtils } = require('../../test-utilities/javascript/APIUtils');

const loginPayload = { userEmail: 'anshika@gmail.com', userPassword: 'Iamking@000' };
const emptyOrders = { data: [], message: 'No Orders' };
let apiContext;
let token;

test.beforeAll(async () => {
  apiContext = await request.newContext();
  token = await new APIUtils(apiContext, loginPayload).getToken();
});

test.afterAll(async () => {
  await apiContext.dispose();
});

async function openEmptyOrderHistory(page) {
  await page.addInitScript((authToken) => {
    window.localStorage.setItem('token', authToken);
  }, token);
  await page.route(
    'https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*',
    (route) => route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(emptyOrders),
    }),
  );
  await page.goto('https://rahulshettyacademy.com/client/');
  await page.locator("button[routerlink*='myorders']").click();
}

test('shows the empty order history state', async ({ page }) => {
  await openEmptyOrderHistory(page);
  await expect(page.locator('.mt-4')).toContainText('No Orders');
});

test('hides order actions when history is empty', async ({ page }) => {
  await openEmptyOrderHistory(page);
  await expect(page.locator('.mt-4')).toContainText('No Orders');
  await expect(page.locator("button:has-text('View')")).toHaveCount(0);
});
