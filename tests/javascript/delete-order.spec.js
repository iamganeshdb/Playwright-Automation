// Verifies order deletion while intercepting the request to protect account data.
const { expect, test } = require('@playwright/test');
const { login, mockOrder, mockOrderId } = require('./ecommerce-test-helpers');

test('deletes the mocked order without modifying account data', async ({ page }) => {
  let orderDeleted = false;
  let deleteRequestUrl = '';

  await page.route('**/api/ecom/order/**', async (route) => {
    const requestUrl = route.request().url();
    if (requestUrl.includes('/get-orders-for-customer/')) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: orderDeleted ? [] : [mockOrder],
          count: orderDeleted ? 0 : 1,
          message: orderDeleted ? 'No Orders' : 'Orders fetched Successfully',
        }),
      });
      return;
    }

    if (requestUrl.toLowerCase().includes('delete')) {
      deleteRequestUrl = requestUrl;
      orderDeleted = true;
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Order Deleted Successfully' }),
      });
      return;
    }

    await route.continue();
  });

  await login(page);
  await page.locator("button[routerlink*='myorders']").click();
  const row = page.locator('tbody tr').filter({ hasText: mockOrder.productName });
  await expect(row).toBeVisible();
  await row.getByRole('button', { name: 'Delete' }).click();

  await expect(row).toHaveCount(0);
  expect(deleteRequestUrl).toContain(mockOrderId);
});
