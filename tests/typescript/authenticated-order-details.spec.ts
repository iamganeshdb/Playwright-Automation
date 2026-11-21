// Saves an authenticated browser state, places an order, and opens it from order history.
import { expect, test, type BrowserContext } from '@playwright/test';

const orderData = require('../../test-utilities/shared/placeOrder.json')[0] as {
  userName: string;
  passWord: string;
  productName: string;
  cardNumber: string;
  cvv: string;
  country: string;
};

let webContext: BrowserContext;

test.beforeAll(async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto('https://rahulshettyacademy.com/client/#/auth/login');
  await page.locator('#userEmail').fill(orderData.userName);
  await page.locator('#userPassword').fill(orderData.passWord);
  await page.locator('#login').click();
  await page.locator('.card-body').first().waitFor({ state: 'visible' });

  await context.storageState({ path: 'state.json' });
  await context.close();
  webContext = await browser.newContext({ storageState: 'state.json' });
});

test.afterAll(async () => {
  await webContext.close();
});

test('reuses authenticated browser state to inspect an order', async () => {
  const page = await webContext.newPage();
  await page.goto('https://rahulshettyacademy.com/client/');

  const product = page.locator('.card-body').filter({ hasText: orderData.productName }).first();
  await product.getByRole('button', { name: 'Add To Cart' }).click();
  await page.locator("[routerlink*='cart']").click();
  await expect(page.locator('h3').filter({ hasText: orderData.productName })).toBeVisible();

  await page.getByRole('button', { name: 'Checkout' }).click();
  await page.locator('[placeholder*="Country"]').pressSequentially(orderData.country.slice(0, 3), { delay: 100 });
  const countryButtons = page.locator('.ta-results button');
  await countryButtons.first().waitFor({ state: 'visible' });
  const countryLabels = await countryButtons.allTextContents();
  const countryIndex = countryLabels.findIndex((label) => label.trim() === orderData.country);
  if (countryIndex === -1) {
    throw new Error(`Country option "${orderData.country}" was not found.`);
  }
  await countryButtons.nth(countryIndex).click();

  await page.locator('.input.txt.text-validated').first().fill(orderData.cardNumber);
  await page.locator("//div[@class='payment__cc']//div[2]//input[1]").fill(orderData.cvv);
  await page.locator('.btnn').click();
  await expect(page.getByText(/Thankyou for the order/i)).toBeVisible();

  const confirmationText = await page.locator('label.ng-star-inserted').textContent();
  const orderId = confirmationText?.match(/[a-f\d]{24}/i)?.[0];
  if (!orderId) {
    throw new Error('Order confirmation did not include an order ID.');
  }
  await page.locator("button[routerlink*='myorders']").click();
  await expect(page.locator('tbody')).toContainText(orderId);
});
