const { test, expect } = require('@playwright/test');
 
 
 
 
test("RS Practice", async ({ page }) => {
    await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
    const DocumentLink=page.locator("[href*=documents-request]");
    const username=page.locator('#username').fill("rahulshettyacademy");
    await page.locator('#username').fill("rahulshettyacademy");
    await page.locator("#password").fill("Learning@830$3mK2");
    const pi=await page.locator("select.form-control");
    await pi.selectOption("stud");
    await page.locator(".radiotextsty").last().click();
    await page.locator("#okayBtn").click();
    await expect(page.locator(".radiotextsty").last()).toBeChecked();
    console.log(await page.locator(".radiotextsty").last().isChecked());
    await page.locator("#terms").click();
    await page.locator("#terms").uncheck();
    await page.locator("#terms").click();
    
    expect(page.locator("#terms").isChecked()).toBeTruthy();
    await expect(DocumentLink).toHaveAttribute("class","blinkingText");

});

 
test("Child Window", async ({browser}) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
    const DocumentLink = page.locator("[href*=documents-request]");

    const [newPage] = await Promise.all([
        context.waitForEvent("page"),
        DocumentLink.click()
    ]);
    const text = await newPage.locator(".red").textContent();
    console.log(text);
    const mail=text.split("@")[1].split(" ")[0];
    //console.log(mail);
    await page.locator("#username").fill(mail);
    await page.pause();
    console.log(await page.locator("#username").inputValue());

    


}












);