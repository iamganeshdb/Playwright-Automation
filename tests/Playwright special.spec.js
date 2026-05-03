const { test, expect } = require('@playwright/test');
 
 
 
 
test("Playwright special", async ({ page }) => {
    await page.goto("https://rahulshettyacademy.com/angularpractice/");
    await page.getByLabel("Check me out if you Love IceCreams!").check();
    await page.getByLabel("Employed").click();
    await page.getByLabel("Gender").selectOption("Female");
    await page.getByPlaceholder("Passwor").fill("12345678");
    await page.getByRole("button", { name:'Submit'}).click();
    const ab = await page.getByText("Success! The Form has been submitted successfully!")
    await page.getByRole("link" , {name:'Shop'}).click();
    await page.locator("app-card").filter({ hasText : "Nokia Edge"}).getByRole("button" , {name:'add'}).click();
     

});