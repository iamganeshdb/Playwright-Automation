// Verifies order history renders a deterministic order returned by the API.
const { expect, test } = require('@playwright/test');
const { login, mockOrder, stubOrderHistory } = require('./ecommerce-test-helpers');

test('shows order history entries and their available actions', async ({ page }) => {
  await stubOrderHistory(page);
  await login(page);
  await page.locator("button[routerlink*='myorders']").click();

  const row = page.locator('tbody tr').filter({ hasText: mockOrder.productName });
  await expect(row).toHaveCount(1);
  await expect(row.locator('th')).toContainText(mockOrder._id);
  await expect(row.getByRole('button', { name: 'View' })).toBeVisible();
  await expect(row.getByRole('button', { name: 'Delete' })).toBeVisible();
});
