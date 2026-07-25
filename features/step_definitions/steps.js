const {Given,When ,Then} = require('@cucumber/cucumber');
const { POManager } = require('../../PageObject.js/POManager.js');
const{chromium} = require('playwright');


Given('a login to Ecommerce application with {string} and {string}', async function (username, password) {
           // Write code here that turns the phrase above into concrete actions
         
        const browser = await chromium.launch();
        const context = await browser.newContext();
        this.page = await context.newPage();//By adding this scope will not end in method instead it will be stored in world constructor available for all the methods in this class
        this.poManager = new POManager(this.page);
        const products = this.page.locator(".card-body");
        const LoginPage = this.poManager.getLoginPage();
        this.cartPage = this.poManager.getCartPage();
        await LoginPage.goto(); //when u are calling async methods , while calling prefix with await
        await LoginPage.validLogin(username, password);
        const dashboardPage = this.poManager.getDashboardPage();
         });

When('Add {string} to the cart', async function (productName) {
           // Write code here that turns the phrase above into concrete actions
           const dashboardPage = this.poManager.getDashboardPage();
           await dashboardPage.SearchProduct(productName);
        await dashboardPage.navigateToCart();
           
         });


When('Proceed to checkout and fill the details with {string},{string},{string}', {timeout: 100*1000}, async function (cardnumber,cvv,country) {
    console.log("Step started");

           // Write code here that turns the phrase above into concrete actions
           //const cartPage = this.poManager.getCartPage();
           console.log("Enter Details");

           await this.cartPage.enterDetails(cardnumber,cvv);
           console.log("Enter Country");

        await this.cartPage.addInfo(country);
        console.log("Step Ended");

         });


         Then('Verify the order is placed successfully', async function () {
           // Write code here that turns the phrase above into concrete actions
           await this.page.locator("button[routerlink*='myorders']").click();
           await this.page.locator("tbody").first().waitFor();
           const rows = this.page.locator("tbody tr");
           const rowCount = await rows.count();

           if (rowCount === 0) {
               throw new Error('No orders were found in the order history.');
           }
         });
        