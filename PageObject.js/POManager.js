const { loginPage } = require("./LoginPage");
const { Dashboardpage } = require("./DashboardPage");
const { Cart } = require("./Cart"); 


class POManager {
    constructor(page) {
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