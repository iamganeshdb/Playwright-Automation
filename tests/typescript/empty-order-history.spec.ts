// Mocks an empty orders response and verifies the empty-history message and missing order actions.
import { expect, request, test } from '@playwright/test';
import { ApiTestUtils } from '../../test-utilities/typescript/api-test-utils';

const loginPayload = {
  userEmail: 'anshika@gmail.com',
  userPassword: 'Iamking@000',
};
const emptyOrders = { data: [], message: 'No Orders' };
let token: string;

test.beforeAll(async () => {
  const apiContext = await request.newContext();
  try {
    token = await new ApiTestUtils(apiContext, loginPayload).getToken();
  } finally {
    await apiContext.dispose();
  }
});

async function openEmptyOrderHistory(page: import('@playwright/test').Page): Promise<void> {
  await page.addInitScript((authToken: string) => {
    window.localStorage.setItem('token', authToken);
  }, token);
  await page.route('https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(emptyOrders) }),
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
