// Runs the configured product checkout flows through the TypeScript page objects.
import { expect, test } from '@playwright/test';
import { POManager } from '../../page-objects/typescript/POManager';

interface OrderData {
  userName: string;
  passWord: string;
  productName: string;
  cardNumber: string;
  cvv: string;
  country: string;
}

const placeOrderData = require('../../test-utilities/shared/placeOrder.json') as OrderData[];

for (const data of placeOrderData) {
  test(`places an order for ${data.productName} using TypeScript page objects`, async ({ page }) => {
    test.setTimeout(180000);
    const pageObjects = new POManager(page);
    const loginPage = pageObjects.getLoginPage();
    const cartPage = pageObjects.getCartPage();

    await loginPage.goto();
    await loginPage.validLogin(data.userName, data.passWord);

    const dashboardPage = pageObjects.getDashboardPage();
    await dashboardPage.SearchProduct(data.productName);
    await dashboardPage.navigateToCart();
    await cartPage.enterDetails(data.cardNumber, data.cvv);
    await cartPage.addInfo(data.country);

    const confirmationText = await page.locator('label.ng-star-inserted').textContent();
    const orderId = confirmationText?.match(/[a-f\d]{24}/i)?.[0];
    if (!orderId) {
      throw new Error('Order confirmation did not include an order ID.');
    }

    await page.locator("button[routerlink*='myorders']").click();
    const rows = page.locator('tbody tr');
    await expect(rows.first()).toBeVisible();
    let orderFound = false;
    for (let index = 0; index < await rows.count(); index++) {
      const rowOrderId = (await rows.nth(index).locator('th').textContent())?.trim();
      if (rowOrderId && orderId.includes(rowOrderId)) {
        await rows.nth(index).locator('button').first().click();
        orderFound = true;
        break;
      }
    }

    expect(orderFound).toBeTruthy();
    await expect(page.locator('.col-text')).toContainText(orderId);
  });
}

