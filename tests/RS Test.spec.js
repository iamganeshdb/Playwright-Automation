const { test, expect } = require('@playwright/test');
const { isArrayBufferView } = require('util/types');
 
 
 
 
test("Ganesh Practice", async ({ page }) => {
    const products=page.locator(".card-body");
    const productName="ZARA COAT 3";
    const email="anshika@gmail.com"
    await page.goto("https://rahulshettyacademy.com/client/#/auth/login");
    await page.locator("#userEmail").fill(email);
    await page.locator("#userPassword").fill("Iamking@000");
    await page.locator("#login").click();
    await page.waitForLoadState("networkidle");
   
const open=await page.locator(".card-body b").first().textContent();
const appl=await page.locator(".card-body b").allTextContents();
console.log(appl);
 
const count=await products.count();
for(let i=0;i<count;i++)
{
    if(await products.nth(i).locator("b").textContent()===productName)
    {
        await products.nth(i).locator("text= Add To Cart").click();
        break;
    }
}
await page.locator("[routerlink*='cart']").click();
await page.locator("div li").first().waitFor();
//await page.locator("h3:has-text('ZARA COAT 3')").isVisible();
const bool=await page.locator("h3:has-text('ZARA COAT 3')").isVisible();
expect(bool).toBeTruthy();
await page.locator("text=Checkout").click();




await page.locator("[placeholder*='Country']").pressSequentially("Ind",{delay:1000});
 const options=page.locator(".ta-results");
await options.waitFor();
const count1=await options.locator("button").count();
for(let i=0;i<count1;i++)
{
    if(await options.locator("button").nth(i).textContent()===" India")
    {
        await options.locator("button").nth(i).click();
        break;
    }
}
 
expect(page.locator(".mt-5 [type=text]").first()).toHaveText(email);
await page.locator(".input.txt.text-validated").first().fill("4542 9931 9292 2293");
await page.locator("//div[@class='payment__cc']//div[2]//input[1]").fill("123");
await page.locator(".btnn").click();

const cartId=await page.locator("label.ng-star-inserted").textContent();
console.log(cartId);

await page.locator("button[routerlink*='myorders']").click();
await page.locator("tbody").first().waitFor();
const rows=await page.locator("tbody tr")
    
for(let i=0;i<await rows.count();i++)
{
    const rowoderid=await rows.nth(i).locator("th").textContent();
    if (await cartId.includes(rowoderid))
    {
    await rows.nth(i).locator("button").first().click();
    break;
    }
}


}
); 


