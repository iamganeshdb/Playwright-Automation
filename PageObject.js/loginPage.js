class loginPage 
{
    constructor(page)//Add all locators in Constructor
    {
        this.page=page;
        this.signIn=page.locator("#login");
        this.userName=page.locator("#userEmail");
        this.passWord=page.locator("#userPassword");
    }

    async goto()
    {
        await this.page.goto("https://rahulshettyacademy.com/client/#/auth/login");
    }
    async validLogin(userName,passWord)
    {
         
    await this.userName.fill(userName);
    await this.passWord.fill(passWord);
    await this.signIn.click();
    await this.page.waitForSelector('.card-body', { timeout: 30000 });
    await this.page.waitForLoadState("networkidle");
    }

}
module.exports={loginPage};