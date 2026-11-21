// Checks Google's page title and submits the Teachable OTP sign-up form.
import { expect, test } from '@playwright/test';

test('shows the Google homepage title', async ({ browser }) => {
  const context = await browser.newContext();
  try {
    const page = await context.newPage();
    await page.goto('https://www.google.com/');
    await expect(page).toHaveTitle('Google');
  } finally {
    await context.close();
  }
});

test('submits the OTP sign-up form', async ({ page }) => {
  const signIn = page.locator('#otp-login-btn');
  await page.goto('https://sso.teachable.com/secure/9521/identity/sign_up/otp?wizard_id=R9Sid7Bfn4bJnH1qv39bGondu2sXQQWFOGnUNrhvf_n4MYK9jlL8Kzw_XxKkHadNQKVkidvTI6sU_qL8L3yb2Q');
  await page.locator('#name').fill('Ganesh');
  await page.locator('#email').fill('iamganeshdb@gmail.com');
  await page.getByRole('checkbox').click();
  await signIn.click();
  await expect(signIn).toBeVisible();
});
