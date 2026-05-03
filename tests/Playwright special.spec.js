const { test, expect } = require('@playwright/test');

test("Playwright special", async ({ page }) => {
    await page.goto("https://rahulshettyacademy.com/angularpractice/");
    await page.getByLabel("Check me out if you Love IceCreams!").check();
    await page.getByLabel("Employed").click();
    await page.getByLabel("Gender").selectOption("Female");
    await page.getByPlaceholder("Password").fill("12345678");
    await page.getByRole("button", { name:'Submit'}).click();
    
    // Add assertion for success message
    const successMsg = await page.getByText("Success! The Form has been submitted successfully!");
    await expect(successMsg).toBeVisible();
    
    await page.getByRole("link" , {name:'Shop'}).click();
    await page.locator("app-card").filter({ hasText : "Nokia Edge"}).getByRole("button" , {name:'Add'}).click();
});
