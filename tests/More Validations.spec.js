const{test,expect}=require('@playwright/test');

test("MoreValidation",async({page})=>{
    await page.goto("https://rahulshettyacademy.com/Automationpractice/");
    // await page.goto("https://google.com");
    // await page.goBack();
    // await page.goForward();
    await expect(page.locator("#displayed-text")).toBeVisible();
    await page.locator("#hide-textbox").click();
    await expect(page.locator("#displayed-text")).toBeHidden();
    await page.locator("#confirmbtn").click();
    await page.on("dialog", dialog => dialog.accept());
    await page.locator("#mousehover").hover();
    // const framePage = page.frameLocator("#courses-iframe");
    // await framePage.locator("li a[href*='lifetime-access'] : visible").click();
    // const textCheck=await framePage.locator(".text h2").textContent();
    // console.log(textCheck.split(" ")[1]);

      
})
test("Screenshot and Comaprision",async({page})=>
{
    await page.goto("https://rahulshettyacademy.com/Automationpractice/");
    await expect(page.locator("#displayed-text")).toBeVisible();
    await page.locator("#displayed-text").screenshot({path:"DisplayedText.png"});
    await page.locator("#hide-textbox").click();
    await page.screenshot({path:"Screenshot.png"});
})


test.only("Visual",async({page})=>
{
    await page.goto("https://google.com/");
    expect( await page.screenshot()).toMatchSnapshot("Google.png",{animations:false});
})