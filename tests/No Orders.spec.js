const { test, expect ,request} = require('@playwright/test');
const{APIUtils}=require('./Utils/APIUtils');
const { stringify } = require('node:querystring');
const loginpayload={userEmail: "anshika@gmail.com", userPassword: "Iamking@000"};
const orderpayload={orders: [{country: "Afghanistan", productOrderedId: "6960eae1c941646b7a8b3ed3"}]}
const fakePayLoadOrders = { data: [], message: "No Orders" };

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
              
        await page.route("https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*",
            async route => {
                //const response=await page.request.fetch(route.request());
                let body=JSON.stringify(fakePayLoadOrders);
                await route.fulfill(
                    {
                        body,
                    
                
      //intercepting response -APi response-> { playwright fakeresponse}->browser->render data on front end
    });
});
            await page.locator("button[routerlink*='myorders']").click();
            
            const text = await page.locator(".mt-4").textContent();
            await page.pause();
            console.log(text);
           
                
            
            
            
            }
            );
     