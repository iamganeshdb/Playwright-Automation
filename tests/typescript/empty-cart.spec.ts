// Verifies an empty cart has no checkout action.
import { expect, test } from '@playwright/test';
import { login } from '../../test-utilities/typescript/ecommerce-test-helpers';

test('shows the empty cart state and prevents checkout', async ({ page }) => {
  await login(page);
  await page.locator("[routerlink*='cart']").click();

  await expect(page.getByText('No Products in Your Cart !', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Checkout' })).toHaveCount(0);
});
