// Logs in, places a ZARA COAT 3 order, and opens the matching entry from order history.
const { test, expect } = require('@playwright/test');
test('@web places an order and finds it in order history', async ({ page }) => {
    const productName = 'ZARA COAT 3';
    const email = 'anshika@gmail.com';
    const password = 'Iamking@000';

    await page.goto('https://rahulshettyacademy.com/client/#/auth/login');
    await page.locator('#userEmail').fill(email);
    await page.locator('#userPassword').fill(password);
    await page.locator('#login').click();
    await page.locator('.card-body').first().waitFor({ state: 'visible' });

    const product = page.locator('.card-body').filter({ hasText: productName }).first();
    await product.getByRole('button', { name: 'Add To Cart' }).click();
    await page.locator("[routerlink*='cart']").click();
    await expect(page.locator('h3').filter({ hasText: productName })).toBeVisible();
    await page.getByRole('button', { name: 'Checkout' }).click();

    await page.locator("[placeholder*='Country']").pressSequentially('Ind', { delay: 1000 });
    const countryOptions = page.locator('.ta-results button');
    await countryOptions.first().waitFor({ state: 'visible' });
    const countryLabels = await countryOptions.allTextContents();
    const indiaIndex = countryLabels.findIndex((label) => label.trim() === 'India');
    if (indiaIndex === -1) {
        throw new Error('Country option "India" was not found.');
    }
    await countryOptions.nth(indiaIndex).click();

    await page.locator('.input.txt.text-validated').first().fill('4542 9931 9292 2293');
    await page.locator("//div[@class='payment__cc']//div[2]//input[1]").fill('123');
    await page.locator('.btnn').click();
    await expect(page.getByText(/Thankyou for the order/i)).toBeVisible();

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
            orderFound = true;
            break;
        }
    }
    expect(orderFound).toBeTruthy();
});

