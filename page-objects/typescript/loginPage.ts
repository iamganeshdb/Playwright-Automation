import { type Locator, type Page } from '@playwright/test';

export class LoginPage
{
    page: Page;
    signIn: Locator;
    userName: Locator;
    passWord: Locator;

    constructor(page: Page)
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
    async validLogin(userName: string, passWord: string): Promise<void>
    {
        await this.userName.fill(userName);
        await this.passWord.fill(passWord);
        await this.signIn.click();
        await this.page.locator('.card-body').first().waitFor({ state: 'visible', timeout: 30000 });
    }
}