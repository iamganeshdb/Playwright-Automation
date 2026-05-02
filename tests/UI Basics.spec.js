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
await page.locator('#name').fill("Ganesh");
await page.locator("#email").fill("48393904843");
await page.getByRole('checkbox').click();
await page.locator('#otp-login-btn').click()
await page.locator('#otp-login-btn').first().waitFor();
console.log(await page.locator('#my-error-id').textContent());
await expect(page.locator('#my-error-id')).toContainText("Invalid email");
await page.waitForLoadState('networkidle');
await email.fill("");
await email.fill("iamganeshdb@gmail.com");
await signin.click();

});