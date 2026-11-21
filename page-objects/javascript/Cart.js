class Cart {
  constructor(page) {
    this.page = page;
    this.checkout = page.locator('text=Checkout');
    this.country = page.locator("[placeholder*='Country']");
    this.options = page.locator('.ta-results');
  }

  async addInfo(country) {
    await this.country.pressSequentially(country.slice(0, 3), { delay: 1000 });
    await this.options.waitFor();
    const buttons = this.options.locator('button');
    const labels = await buttons.allTextContents();
    const countryIndex = labels.findIndex((label) => label.trim() === country);
    if (countryIndex === -1) {
      throw new Error(`Country option "${country}" was not found.`);
    }
    await buttons.nth(countryIndex).click();
    await this.options.waitFor({ state: 'hidden' });
    await this.page.locator('.btnn').click();
  }

  async enterDetails(cardNumber, cvv) {
    await this.checkout.click();
    await this.page.locator('.input.txt.text-validated').first().fill(cardNumber);
    await this.page.locator("//div[@class='payment__cc']//div[2]//input[1]").fill(cvv);
  }
}

module.exports = { Cart };