import type { Page } from '@playwright/test';
import { CartPage } from './Cart';
import { DashboardPage } from './Dashboardpage';
import { LoginPage } from './loginPage';

export class POManager {
    private readonly loginPage: LoginPage;
    private readonly dashboardPage: DashboardPage;
    private readonly cartPage: CartPage;

    constructor(page: Page) {
        this.loginPage = new LoginPage(page);
        this.dashboardPage = new DashboardPage(page);
        this.cartPage = new CartPage(page);
    }

    getLoginPage() {
        return this.loginPage;
    }

    getDashboardPage() {
        return this.dashboardPage;
    }

    getCartPage() {
        return this.cartPage;
    }
}