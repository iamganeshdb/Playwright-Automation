class Dashboardpage
{
constructor(page)
{
    this.products=page.locator(".card-body");
    this.cart=page.locator("[routerlink*='cart']");
}

async SearchProduct(productName)
{
    
   
const open=await this.products.first().textContent();
const appl=await this.products.locator("b").allTextContents();
console.log(appl);
 
const count=await this.products.count();
for(let i=0;i<count;i++)
{
    if(await this.products.nth(i).locator("b").textContent()===productName)
    {
        await this.products.nth(i).locator("text= Add To Cart").click();
        break;
    }
}
}

async navigateToCart()
{
    await this.cart.click();      
 }
}

module.exports={Dashboardpage};