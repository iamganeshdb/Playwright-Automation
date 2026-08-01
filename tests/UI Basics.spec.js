const {test,expect}=require('@playwright/test');
const { constants } = require('buffer');

test('First Playwright Test',async ({browser})=>
{
const context=await browser.newContext();
const page= await context.newPage();
await page.goto('https://www.google.com/');
console.log(await page.title());
await expect(page).toHaveTitle("Google");
});

test('Second Playwright Test',async ({page})=>
{
    const email=page.locator("#email");
    const signin=page.locator('#otp-login-btn');
await page.goto('https://sso.teachable.com/secure/9521/identity/sign_up/otp?wizard_id=R9Sid7Bfn4bJnH1qv39bGondu2sXQQWFOGnUNrhvf_n4MYK9jlL8Kzw_XxKkHadNQKVkidvTI6sU_qL8L3yb2Q');
console.log(await page.title());
page.route('**/*.{png,jpeg}',route=>route.abort());//Blocking the CSS files to speed up the test execution
page.on('request',request=>(console.log(request.url())));
page.on('response',response=>(console.log(response.url(),response.status())));
await page.locator('#name').fill("Ganesh");
await page.locator("#email").fill("iamganeshdb@gmail.com");
await page.getByRole('checkbox').click();
await page.locator('#otp-login-btn').click()
await page.locator('#otp-login-btn').first().waitFor();
await page.waitForLoadState('networkidle');
// await email.fill("");
// await email.fill("iamganeshdb@gmail.com");
// await signin.click();

});