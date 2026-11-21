// Uses the TypeScript page objects to complete checkout and verify the order confirmation.
import { expect, test } from '@playwright/test';
import { POManager } from '../../page-objects/typescript/POManager';

const orderData = require('../../test-utilities/shared/placeOrder.json').find(
  (item: { productName: string }) => item.productName === 'ZARA COAT 3',
) as {
  userName: string;
  passWord: string;
  productName: string;
  cardNumber: string;
  cvv: string;
  country: string;
} | undefined;

test('places an order through checkout and verifies confirmation', async ({ page }) => {
  if (!orderData) {
    throw new Error('ZARA COAT 3 order test data is missing.');
  }

  const poManager = new POManager(page);
  await poManager.getLoginPage().goto();
  await poManager.getLoginPage().validLogin(orderData.userName, orderData.passWord);
  await poManager.getDashboardPage().SearchProduct(orderData.productName);
  await poManager.getDashboardPage().navigateToCart();
  await poManager.getCartPage().enterDetails(orderData.cardNumber, orderData.cvv);
  await poManager.getCartPage().addInfo(orderData.country);

  await expect(page.getByText(/Thankyou for the order/i)).toBeVisible();
});
