// Checks practice login form controls and reads contact information from a child window.
const { test, expect } = require('@playwright/test');
 
 
 
 
test("validates the practice login form controls", async ({ page }) => {
    await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
    const documentLink = page.locator("[href*=documents-request]");
    await page.locator('#username').fill("rahulshettyacademy");
    await page.locator("#password").fill("Learning@830$3mK2");
    await page.locator("select.form-control").selectOption("stud");
    await page.locator(".radiotextsty").last().click();
    await page.locator("#okayBtn").click();
    await expect(page.locator(".radiotextsty").last()).toBeChecked();
    await page.locator("#terms").check();
    await page.locator("#terms").uncheck();
    await page.locator("#terms").check();
    await expect(page.locator("#terms")).toBeChecked();
    await expect(documentLink).toHaveAttribute("class","blinkingText");
});

 
test("reads contact details from the child window", async ({browser}) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
    const DocumentLink = page.locator("[href*=documents-request]");

    const [newPage] = await Promise.all([
        context.waitForEvent("page"),
        DocumentLink.click()
    ]);
    const text = await newPage.locator(".red").textContent();
    if (!text) {
        throw new Error('The child window did not contain contact information.');
    }
    const mail = text.split("@")[1]?.split(" ")[0];
    if (!mail) {
        throw new Error('Could not extract a username from the child-window contact.');
    }
    await page.locator("#username").fill(mail);
    await expect(page.locator("#username")).toHaveValue(mail);
}
);