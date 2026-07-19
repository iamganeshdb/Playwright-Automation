const { test, expect } = require('@playwright/test');
 
    let URL="https://app.pricelabs.co/pricing";
    let username="pricelabs.qa.test@gmail.com";
    let password="Pltest@2026";
 
test("MinandMaxPrice", async ({ page }) => {
    await page.goto(URL);
    await page.getByPlaceholder('Email Address').fill(username);
    await page.getByPlaceholder('Password').fill(password);
    await page.locator('input[name="commit"]').click();
    await page.getByRole('button', { name: 'close' }).click();
    await page.getByRole('button', { name: 'Dynamic Pricing' }).click();
    await page.getByText('Manage Listings', { exact: true }).click();
    await page.locator('input[qa-id*="ml-min-price-input"]').first().fill('200');
    await page.locator('input[qa-id*="ml-max-price-input"]').first().fill('2000');
    await page.pause();
});

test("ClickonReviewPrice", async ({ page }) => {
    await page.goto(URL);
    await page.getByPlaceholder('Email Address').fill(username);
    await page.getByPlaceholder('Password').fill(password);
    await page.locator('input[name="commit"]').click();
    await page.getByRole('button', { name: 'close' }).click();
    await page.getByText('Filters', { exact: true }).click();
    await page.getByRole('menuitemradio', { name: 'PMS' }).click();
    await page.getByRole('option', { name: 'Hostaway' }).getByRole('paragraph').click();
    await page.getByText('Apply Filter', { exact: true }).click();
await page.locator('span').filter({ hasText: 'Review Prices' }).first().click();
await page.pause();
});

test.only("ClickonBillingDetails", async ({ page }) => {
        await page.goto(URL);
        await page.getByPlaceholder('Email Address').fill(username);
        await page.getByPlaceholder('Password').fill(password);
        await page.locator('input[name="commit"]').click();
        await page.getByRole('button', { name: 'close' }).click();
        await page.getByText('Subscribe', { exact: true }).click();
        //Even with manual intervention during automation execution, 
        //the session is not consistently trusted due to browser fingerprinting and security validation.
        //await page.getByText('Billing Details', { exact: true }).click(); 
        //Locator to Click on Billing details tab after Cloudfare check bypass.
        await page.pause();
});


