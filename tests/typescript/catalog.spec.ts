// Verifies that catalog cards show product names, prices, and actions.
import { expect, test } from '@playwright/test';
import { login } from './ecommerce-test-helpers';

test('shows product cards with names, prices, and actions', async ({ page }) => {
  await login(page);

  const products = page.locator('.card-body');
  await expect(products).toHaveCount(3);
  for (const productName of ['ADIDAS ORIGINAL', 'ZARA COAT 3', 'IPHONE 13 PRO']) {
    const product = products.filter({ hasText: new RegExp(productName, 'i') });
    await expect(product).toBeVisible();
    await expect(product.locator('b')).toHaveText(new RegExp(productName, 'i'));
    await expect(product).toContainText('$');
    await expect(product.getByRole('button', { name: 'View' })).toBeVisible();
    await expect(product.getByRole('button', { name: 'Add To Cart' })).toBeVisible();
  }
});
