const { test, expect } = require('@playwright/test');

test('Ecommerce end-to-end flow from login to order confirmation', async ({ page }) => {
  const email = 'anshika@gmail.com';
  const password = 'Iamking@000';
  const productName = 'ZARA COAT 3';

  await page.goto('https://rahulshettyacademy.com/client/#/auth/login');
  await page.locator('#userEmail').fill(email);
  await page.locator('#userPassword').fill(password);
  await page.locator('#login').click();

  await expect(page.locator('.card-body').first()).toBeVisible({ timeout: 30000 });

  const products = page.locator('.card-body');
  const count = await products.count();
  let productFound = false;

  for (let i = 0; i < count; i++) {
    const name = await products.nth(i).locator('b').textContent();
    if (name && name.trim() === productName) {
      await products.nth(i).locator('text=Add To Cart').click();
      productFound = true;
      break;
    }
  }

  expect(productFound).toBeTruthy();

  await page.locator("[routerlink*='cart']").click();
  await expect(page.locator('h3').filter({ hasText: productName })).toBeVisible({ timeout: 20000 });

  await page.locator('text=Checkout').click();
  await page.locator("[placeholder*='Country']").pressSequentially('Ind', { delay: 1000 });

  const options = page.locator('.ta-results');
  await options.waitFor();
  await options.locator('button').filter({ hasText: ' India' }).first().click();

  await page.locator('.input.txt.text-validated').first().fill('4542 9931 9292 2293');
  await page.locator("//div[@class='payment__cc']//div[2]//input[1]").fill('123');
  await page.locator('.btnn').click();

  const orderId = (await page.locator('label.ng-star-inserted').textContent())?.trim();
  expect(orderId).toBeTruthy();

  await page.locator("button[routerlink*='myorders']").click();
  await expect(page.locator('tbody')).toBeVisible({ timeout: 20000 });

  const rows = page.locator('tbody tr');
  const rowCount = await rows.count();
  let orderSeen = false;

  for (let i = 0; i < rowCount; i++) {
    const rowOrderId = await rows.nth(i).locator('th').textContent();
    if (orderId && rowOrderId && rowOrderId.includes(orderId)) {
      orderSeen = true;
      break;
    }
  }

  expect(orderSeen).toBeTruthy();
});
