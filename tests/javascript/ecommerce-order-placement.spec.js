// Uses the cart page object to complete checkout and verify the order confirmation.
const { test, expect } = require('@playwright/test');
const { Cart } = require('../../page-objects/javascript/Cart.js');
test("places an order through checkout and verifies confirmation", async ({ page }) => {
    const productName="ZARA COAT 3";
    const email="ganeshplaywright@gmail.com"
    await page.goto("https://rahulshettyacademy.com/client/#/auth/login");
    await page.getByPlaceholder("email@example.com").fill(email);
    await page.getByPlaceholder("enter your passsword").fill("9731@Ganesh");
    await page.getByRole("button",{name:"Login"}).click();
    await page.locator(".card-body").filter({hasText: productName})
        .getByRole("button",{name:"Add To Cart"}).click();
   await page.getByRole("listitem").getByRole("button",{name:"Cart"}).click();



await page.locator("div li").first().waitFor();
await expect(page.getByText("ZARA COAT 3")).toBeVisible();
const cartPage = new Cart(page);
await cartPage.enterDetails("4542 9931 9292 2293", "123");
await cartPage.addInfo("India");
await expect(page.getByText(/Thankyou for the order/)).toBeVisible();

}
); 


