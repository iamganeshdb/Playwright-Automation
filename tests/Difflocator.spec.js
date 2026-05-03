const { test, expect } = require('@playwright/test');
const { isArrayBufferView } = require('util/types');
 
 
 
 
test("Ganesh Practice", async ({ page }) => {
    const products=page.locator(".card-body");
    const productName="ZARA COAT 3";
    const email="anshika@gmail.com"
    await page.goto("https://rahulshettyacademy.com/client/#/auth/login");
    await page.getByPlaceholder("email@example.com").fill(email);
    await page.getByPlaceholder("enter your passsword").fill("Iamking@000");
    await page.getByRole("button",{name:"Login"}).click();
    await page.waitForLoadState("networkidle");
   await page.locator(".card-body").filter({hasText:"ZARA COAT 3"})
   .getByRole("button",{name:"Add To Cart"}).click();
   await page.getByRole("listitem").getByRole("button",{name:"Cart"}).click();



await page.locator("div li").first().waitFor();
await expect(page.getByText("ZARA COAT 3")).toBeVisible();
await page.getByRole("button",{name:"Checkout"}).click();
await page.getByPlaceholder("Select Country").pressSequentially("Ind",{delay:1000});
await page.getByRole("button",{name:"India"}).nth(1).click();
await page.getByText("PLACE ORDER").click();
await page.locator("tr").first().waitFor();
await page.getByText(" Thankyou for the order. ").isVisible();

expect(await page.getByText(" Thankyou for the order. ")).toBeVisible();

}
); 


