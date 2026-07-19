import { test,expect,Page ,Locator} from "@playwright/test";
export class Dashboardpage
{
    page: Page;
    products: Locator;
    cart: Locator;
    constructor(page: Page)
    {
        this.page = page;
        this.products = page.locator(".card-body");
    this.cart=page.locator("[routerlink*='cart']");
}

async SearchProduct(productName:string)
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