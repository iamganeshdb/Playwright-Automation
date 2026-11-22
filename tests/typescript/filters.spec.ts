// Verifies category and subcategory requests update the visible product list.
import { expect, test } from '@playwright/test';
import { login, stubFilteredCatalog } from '../../test-utilities/typescript/ecommerce-test-helpers';

test('filters products by category and subcategory', async ({ page }) => {
  await stubFilteredCatalog(page);
  await login(page);

  const form = page.locator('form:visible');
  const categoryResponse = page.waitForResponse((response) => (
    response.url().includes('/api/ecom/product/get-all-products')
    && JSON.parse(response.request().postData() || '{}').productCategory?.includes('electronics')
  ));
  await form.locator('.form-group').filter({ hasText: 'electronics' }).locator('input').check();
  await categoryResponse;
  await expect(page.locator('.card-body')).toHaveCount(1);
  await expect(page.locator('.card-body').first()).toContainText(/IPHONE 13 PRO/i);

  const subcategoryResponse = page.waitForResponse((response) => (
    response.url().includes('/api/ecom/product/get-all-products')
    && JSON.parse(response.request().postData() || '{}').productSubCategory?.includes('mobiles')
  ));
  await form.locator('.form-group').filter({ hasText: 'mobiles' }).locator('input').check();
  await subcategoryResponse;
  await expect(page.locator('.card-body')).toHaveCount(1);
  await expect(page.locator('.card-body').first()).toContainText(/IPHONE 13 PRO/i);
});
