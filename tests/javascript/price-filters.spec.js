// Verifies price-range requests display only products in the selected range.
const { expect, test } = require('@playwright/test');
const { login, stubFilteredCatalog } = require('./ecommerce-test-helpers');

test('filters products by minimum and maximum price', async ({ page }) => {
  await stubFilteredCatalog(page);
  await login(page);

  const minPrice = page.locator('form:visible input[placeholder="Min Price"]');
  const maxPrice = page.locator('form:visible input[placeholder="Max Price"]');
  await minPrice.fill('10000');
  await maxPrice.fill('20000');

  const priceFilterResponse = page.waitForResponse((response) => {
    if (!response.url().includes('/api/ecom/product/get-all-products')) {
      return false;
    }
    const body = JSON.parse(response.request().postData() || '{}');
    return Number(body.minPrice) === 10000 && Number(body.maxPrice) === 20000;
  });
  await maxPrice.press('Enter');
  await priceFilterResponse;

  const products = page.locator('.card-body');
  await expect(products).toHaveCount(2);
  await expect(products.nth(0)).toContainText('ADIDAS ORIGINAL');
  await expect(products.nth(1)).toContainText('ZARA COAT 3');
});
