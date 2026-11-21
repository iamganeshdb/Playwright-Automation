// Completes a customer order and verifies the confirmation and resulting order-history entry.
import { expect, test } from '@playwright/test';

interface OrderData {
  userName: string;
  passWord: string;
  productName: string;
  cardNumber: string;
  cvv: string;
  country: string;
}

const orderData = require('../../test-utilities/shared/placeOrder.json').find(
  (item: OrderData) => item.productName === 'ZARA COAT 3',
) as OrderData | undefined;

test('completes checkout and verifies order history', async ({ page }) => {
  if (!orderData) {
    throw new Error('ZARA COAT 3 order test data is missing.');
  }

  test.setTimeout(180000);
  await page.goto('https://rahulshettyacademy.com/client/#/auth/login');
  await page.locator('#userEmail').fill(orderData.userName);
  await page.locator('#userPassword').fill(orderData.passWord);
  await page.locator('#login').click();
  await expect(page.locator('.card-body').first()).toBeVisible({ timeout: 30000 });

  const product = page.locator('.card-body').filter({ hasText: orderData.productName }).first();
  await product.getByRole('button', { name: 'Add To Cart' }).click();
  await page.locator("button[routerlink*='cart']").click();
  await expect(page.locator('h3').filter({ hasText: orderData.productName })).toBeVisible();
  await page.getByRole('button', { name: /checkout/i }).click();
  await expect(page.getByText('Payment Method')).toBeVisible();
  await page.getByText('Credit Card', { exact: true }).click();

  await page.locator('.input.txt.text-validated').first().fill(orderData.cardNumber);
  await page.locator("//div[@class='payment__cc']//div[2]//input[1]").fill(orderData.cvv);
  await page.locator('input[placeholder="Select Country"]')
    .pressSequentially(orderData.country.slice(0, 3), { delay: 100 });
  const countryButtons = page.locator('.ta-results button');
  await countryButtons.first().waitFor({ state: 'visible' });
  const countryLabels = await countryButtons.allTextContents();
  const countryIndex = countryLabels.findIndex((label) => label.trim() === orderData.country);
  if (countryIndex === -1) {
    throw new Error(`Country option "${orderData.country}" was not found.`);
  }
  await countryButtons.nth(countryIndex).click();
  await page.locator('.btnn').click();
  await expect(page.getByText(/Thankyou for the order/i)).toBeVisible({ timeout: 60000 });

  const orderId = (await page.locator('label.ng-star-inserted').textContent())?.trim();
  if (!orderId) {
    throw new Error('Order confirmation did not include an order ID.');
  }
  await page.locator("button[routerlink*='myorders']").click();
  await expect(page.locator('tbody')).toContainText(orderData.productName);
});
