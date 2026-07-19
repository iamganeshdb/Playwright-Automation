import { test,expect,Page ,Locator} from "@playwright/test";
//import { customtest } from "../Utils  TS/testBase";
import { POManager } from "../PageObject_ts/POManager.ts";
//Json>String>Object
const placeOrderData = JSON.parse(JSON.stringify(require('../Utils/placeOrder.json')));
 
 
 
for(const data of placeOrderData)
    {
test(`Ganesh Practice - ${data.productName}`, async ({ page }) => {
    const poManager = new POManager(page)
    const products=page.locator(".card-body");


    
    const LoginPage = poManager.getLoginPage();
    const cartPage = poManager.getCartPage();
    await LoginPage.goto(); //when u are calling async methods , while calling prefix with await
    await LoginPage.validLogin(data.userName,data.passWord);
   

    
    const dashboardPage = poManager.getDashboardPage();
    await dashboardPage.SearchProduct(data.productName);
    await dashboardPage.navigateToCart();
   

await cartPage.enterDetails(data.cardNumber,data.cvv);
await cartPage.addInfo(data.country);



const cartId:any= (await page.locator("label.ng-star-inserted").textContent())?.trim() ?? "";
console.log(cartId);


await page.locator("button[routerlink*='myorders']").click();
await page.locator("tbody").first().waitFor();
// let cartId:any;


const rows=await page.locator("tbody tr")

for (let i = 0; i < await rows.count(); i++) {
    const rowOrderId = (await rows.nth(i).locator("th").textContent())?.trim() ?? "";

    console.log("Order in table:", rowOrderId);

    if (cartId.includes(rowOrderId)) {
        await rows.nth(i).locator("button").first().click();
        break;
    }
}


}
); 
}

