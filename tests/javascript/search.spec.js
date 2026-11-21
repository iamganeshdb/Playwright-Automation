// Checks matching and empty-result product searches.
const { expect, test } = require('@playwright/test');
const { login } = require('./ecommerce-test-helpers');

test('searches for matching products and displays an empty state for no match', async ({ page }) => {
  await login(page);

  const search = page.locator('form:visible input[placeholder="search"]');
  await search.fill('ZARA COAT 3');
  await search.press('Enter');
  await expect(page.locator('.card-body')).toHaveCount(1);
  await expect(page.locator('.card-body').first()).toContainText('ZARA COAT 3');

  await search.fill('no-product-match-xyz');
  await search.press('Enter');
  await expect(page.locator('.card-body')).toHaveCount(0);
  await expect(page.getByText('No Products Found', { exact: true })).toBeVisible();
});
