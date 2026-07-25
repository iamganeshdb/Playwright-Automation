class Dashboardpage
{
constructor(page)
{
    this.products=page.locator(".card-body");
    this.cart=page.locator("[routerlink*='cart']");
}

async SearchProduct(productName)
{
    const expectedName = productName.trim().toLowerCase();
    const count = await this.products.count();

    for (let i = 0; i < count; i++) {
        const actualName = (await this.products.nth(i).locator("b").textContent()).trim().toLowerCase();
        if (actualName === expectedName) {
            await this.products.nth(i).locator("text= Add To Cart").click();
            return;
        }
    }

    throw new Error(`Product not found: ${productName}`);
}

async navigateToCart()
{
    await this.cart.click();      
 }
}

module.exports={Dashboardpage};