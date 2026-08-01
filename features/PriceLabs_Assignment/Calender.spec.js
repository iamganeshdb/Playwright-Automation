const { test, expect } = require('@playwright/test');
const { isArrayBufferView } = require('util/types');
 
 
 
 
test("Calendar Validation", async ({ page }) => {
    const date="16";
    const monthnumber="3";
    const year="2024";
    const expectedlist=[monthnumber,date,year];
   await page.goto("https://rahulshettyacademy.com/seleniumPractise/#/offers");
   await page.locator(".react-date-picker__inputGroup").click();
   await page.locator(".react-calendar__navigation__label__labelText").click();
   await page.locator(".react-calendar__navigation__label__labelText").click();
   await page.getByText(year).click();
   await page.locator(".react-calendar__tile").nth(Number(monthnumber) - 1).click();
  await page.locator("//abbr[text()='"+date+"']").click();
   await page.locator("body").click();
    const inputs=page.locator(".react-date-picker__inputGroup__input");

    for(let i=0;i<expectedlist.length;i++){
       await expect(inputs.nth(i)).toHaveValue(expectedlist[i]);
 
    }

});