//const { loginPage } = require("./LoginPage");
import {loginPage} from "./loginPage";
import {Dashboardpage} from "./Dashboardpage";
import {Cart} from "./Cart";
import { Page } from "@playwright/test";
//const { Dashboardpage } = require("./DashboardPage");
//const { Cart } = require("./Cart"); 


export class POManager {
    LoginPage: loginPage;//Type - LoginPage object is going to be stored in this variable.
    DashboardPage: Dashboardpage;
    CartPage: Cart;
    page: Page;
    constructor(page:Page) {
        this.page = page;
        this.LoginPage = new loginPage(page);
        this.DashboardPage = new Dashboardpage(page);
        this.CartPage = new Cart(page);
    }



    getLoginPage() {
        return this.LoginPage;
    }

    getDashboardPage() {
        return this.DashboardPage;
    }

    getCartPage() {
        return this.CartPage;
    }
}
module.exports = { POManager };