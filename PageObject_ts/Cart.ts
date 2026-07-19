import { test,expect,Page ,Locator} from "@playwright/test";

export class Cart
{
    page: Page;
    checkout: Locator;
    country: Locator;
    options: Locator;

    constructor(page: Page)
    {
        this.page=page;
        this.checkout = page.locator("text=Checkout");
        this.country = page.locator("[placeholder*='Country']");//.pressSequentially("Ind",{delay:1000});
        this.options=page.locator(".ta-results");
        
    }
    async addInfo(country: string)
    {
       
        await this.country.pressSequentially("Ind",{delay:1000});
        await this.options.waitFor();
        //const count1=await this.options.locator("button").count();
        const buttons = this.options.locator("button");
const count = await buttons.count();

for (let i = 0; i < count; i++) {
    const text = ((await buttons.nth(i).textContent()) ?? "").trim();
    //const text = (await buttons.nth(i).textContent()).trim();
    console.log(`Option ${i}: '${text}'`);

    if (text === country) {
        await buttons.nth(i).click();
        break;
    }
}

await this.options.waitFor({ state: "hidden" });
await this.page.locator(".btnn").click();
    }


    async enterDetails(cardNumber: string, cvv: string)
    {
         await this.checkout.click();
        await this.page.locator(".input.txt.text-validated").first().fill(cardNumber);
await this.page.locator("//div[@class='payment__cc']//div[2]//input[1]").fill(cvv);
    }

}

module.exports={Cart};