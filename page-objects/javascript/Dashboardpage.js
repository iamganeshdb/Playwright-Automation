class Dashboardpage {
  constructor(page) {
    this.products = page.locator('.card-body');
    this.cart = page.locator("[routerlink*='cart']");
  }

  async SearchProduct(productName) {
    const product = this.products.filter({ hasText: productName }).first();
    await product.getByRole('button', { name: 'Add To Cart' }).click();
  }

  async navigateToCart() {
    await this.cart.click();
  }
}

module.exports = { Dashboardpage };