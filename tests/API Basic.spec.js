const { test, expect ,request} = require('@playwright/test');
const{APIUtils}=require('./Utils/APIUtils');
const loginpayload={userEmail: "anshika@gmail.com", userPassword: "Iamking@000"};
const orderpayload={orders: [{country: "Afghanistan", productOrderedId: "6960eae1c941646b7a8b3ed3"}]}

let response;

test.beforeAll( async()=>
{
  const apiContext=await request.newContext();
const apiUtils=new APIUtils(apiContext,loginpayload)
response =  await apiUtils.createOrder(orderpayload);
}

)
 
 
 //Inserting into Browser Local Storage before page load
test("Ganesh Practice", async ({ page }) => {
// const orderId=createOrder(orderpayload);
// const APIUtils=new APIUtils(apiContext,loginpayload);


    await page.addInitScript(value=>
    {
        window.localStorage.setItem('token',value);
    }, response.token);

    
    await page.goto("https://rahulshettyacademy.com/client/");
    // await page.locator("#userEmail").fill(email);
    // await page.locator("#userPassword").fill("Iamking@000");
    // await page.locator("#login").click();
    // await page.waitForLoadState("networkidle");
await page.locator("button[routerlink*='myorders']").click();
await page.locator("tbody").first().waitFor();
const rows=await page.locator("tbody tr")
    
for(let i=0;i<await rows.count();i++)
{
    const rowoderid=await rows.nth(i).locator("th").textContent();
    if (response.orderId.includes(rowoderid))
    {
    await rows.nth(i).locator("button").first().click();
    break;
    }
}
const orderIdDetails =await page.locator(".col-text").textContent();
//await page.pause();
expect(response.orderId.includes(orderIdDetails)).toBeTruthy();


}
); 


