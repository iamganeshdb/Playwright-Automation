import { type Locator, type Page } from '@playwright/test';

export class DashboardPage {
  products: Locator;
  cart: Locator;

  constructor(page: Page) {
    this.products = page.locator('.card-body');
    this.cart = page.locator("[routerlink*='cart']");
  }

  async SearchProduct(productName: string): Promise<void> {
    const product = this.products.filter({ hasText: productName }).first();
    await product.getByRole('button', { name: 'Add To Cart' }).click();
  }

  async navigateToCart(): Promise<void> {
    await this.cart.click();
  }
}