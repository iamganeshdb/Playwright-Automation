const { test, expect } = require('@playwright/test');

test('Place an order from the Rahul Shetty e-commerce app', async ({ page }) => {
  const email = 'ganeshplaywright@gmail.com';
  const password = '9731@Ganesh';
  const productName = 'ZARA COAT 3';
  const cardNumber = '4542 9931 9292 2293';
  const cvv = '123';
  const country = 'India';

  test.setTimeout(180000);

  await page.goto('https://rahulshettyacademy.com/client/#/auth/login');
  await page.locator('#userEmail').fill(email);
  await page.locator('#userPassword').fill(password);
  await page.locator('#login').click();

  await expect(page.locator('.card-body').first()).toBeVisible({ timeout: 30000 });

  const products = page.locator('.card-body');
  let productFound = false;

  for (let i = 0; i < await products.count(); i++) {
    const name = await products.nth(i).locator('b').textContent();
    if (name && name.trim() === productName) {
      await products.nth(i).locator('text=Add To Cart').click();
      productFound = true;
      break;
    }
  }

  expect(productFound).toBeTruthy();

  await page.locator("button[routerlink*=\'cart\']").click();
  await expect(page.locator('h3').filter({ hasText: productName })).toBeVisible({ timeout: 20000 });

  await page.getByRole('button', { name: /checkout/i }).click();
  await expect(page.locator('text=Payment Method')).toBeVisible({ timeout: 20000 });

  await page.locator('text=Credit Card').click();
  await page.locator('.input.txt.text-validated').first().fill(cardNumber);
  await page.locator("//div[@class='payment__cc']//div[2]//input[1]").fill(cvv);
  await page.locator('input[placeholder="Select Country"]').fill(country);
  await page.locator('button:has-text("India")').first().click();
  await page.locator('button[type="submit"]').click();

  await expect(page.locator('text=Order Placed Successfully')).toBeVisible({ timeout: 60000 });

  await page.locator("button[routerlink*=\'myorders\']").click();
  await expect(page.locator('tbody')).toBeVisible({ timeout: 20000 });
  await expect(page.locator('tbody')).toContainText(productName);
});
