const { loginPage } = require('./loginPage.js');
const { Dashboardpage } = require('./Dashboardpage.js');
const { Cart } = require('./Cart.js');

class POManager {
  constructor(page) {
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