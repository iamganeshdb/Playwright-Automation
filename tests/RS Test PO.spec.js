import { test } from "@playwright/test";
// const { test, expect } = require('@playwright/test');
// const {customtest} = require('../Utils/testBase.js');
// const {loginPage} = require('./PageObject.js/loginPage');
// const {Dashboardpage} = require('./PageObject.js/DashboardPage');
// const {Cart} = require('./PageObject.js/Cart');
const { POManager } = require('../PageObject.js/POManager.js');
//Json>String>Object
const placeOrderData = JSON.parse(JSON.stringify(require('../Utils/placeOrder.json')));
for (const data of placeOrderData) {
    test(`Ganesh Practice - ${data.productName}`, async ({ page }) => {
        const poManager = new POManager(page);
        const products = page.locator(".card-body");
        // const productName=data.productName;
        // const userName=data.userName;
        // const cardNumber=data.cardNumber;
        // const cvv=data.cvv;
        // const country=data.country;
        // const passWord = data.passWord;
        const LoginPage = poManager.getLoginPage();
        const cartPage = poManager.getCartPage();
        await LoginPage.goto(); //when u are calling async methods , while calling prefix with await
        await LoginPage.validLogin(data.userName, data.passWord);
        //await page.waitForSelector('.card-body', { timeout: 300000 });
        //await page.locator(".card-body").filter({hasText:"ZARA COAT 3"})
        //.getByRole("button",{name:"Add To Cart"}).click();
        // await page.getByRole("listitem").getByRole("button",{name:"Cart"}).click();
        const dashboardPage = poManager.getDashboardPage();
        await dashboardPage.SearchProduct(data.productName);
        await dashboardPage.navigateToCart();
        // const open=await page.locator(".card-body b").first().textContent();
        // const appl=await page.locator(".card-body b").allTextContents();
        // console.log(appl);
        // const count=await products.count();
        // for(let i=0;i<count;i++)
        // {
        //     if(await products.nth(i).locator("b").textContent()===productName)
        //     {
        //         await products.nth(i).locator("text= Add To Cart").click();
        //         break;
        //     }
        // }
        //await page.locator("[routerlink*='cart']").click();
        // await page.locator("div li").first().waitFor();
        // //await page.locator("h3:has-text('ZARA COAT 3')").isVisible();
        // const bool=await page.locator("h3:has-text('ZARA COAT 3')").isVisible();
        // expect(bool).toBeTruthy();
        // //await page.locator("text=Checkout").click();
        // const cartPage = new Cart(page);
        await cartPage.enterDetails(data.cardNumber, data.cvv);
        await cartPage.addInfo(data.country);
        // await page.locator("[placeholder*='Country']").pressSequentially("Ind",{delay:1000});
        //  const options=page.locator(".ta-results");
        // await options.waitFor();
        // const count1=await options.locator("button").count();
        // for(let i=0;i<count1;i++)
        // {
        //     if(await options.locator("button").nth(i).textContent()===" India")
        //     {
        //         await options.locator("button").nth(i).click();
        //         break;
        //     }
        // }
        // expect(page.locator(".mt-5 [type=text]").first()).toHaveText(userName);
        // await page.locator(".input.txt.text-validated").first().fill("4542 9931 9292 2293");
        // await page.locator("//div[@class='payment__cc']//div[2]//input[1]").fill("123");
        // await page.locator(".btnn").click();
        const cartId = await page.locator("label.ng-star-inserted").textContent();
        console.log(cartId);
        await page.locator("button[routerlink*='myorders']").click();
        await page.locator("tbody").first().waitFor();
        const rows = await page.locator("tbody tr");
        for (let i = 0; i < await rows.count(); i++) {
            const rowoderid = await rows.nth(i).locator("th").textContent();
            if (await cartId.includes(rowoderid)) {
                await rows.nth(i).locator("button").first().click();
                break;
            }
        }
    });
}
