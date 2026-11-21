const { Given, When, Then } = require('@cucumber/cucumber');
const assert = require('node:assert/strict');
const { expect } = require('@playwright/test');

const mockOrderId = 'test-order-id-000000000001';
const mockOrder = {
  _id: mockOrderId,
  orderById: 'test-customer-id',
  orderBy: 'Playwright Test',
  productOrderedId: 'test-product-id',
  productName: 'ZARA COAT 3',
  country: 'India',
  productDescription: 'Test product',
  productImage: '',
  orderDate: '2025-01-01',
  orderPrice: 11500,
  __v: 0,
};

async function stubFilteredCatalog(page) {
  await page.route('**/api/ecom/product/get-all-products', async (route) => {
    const requestBody = JSON.parse(route.request().postData() || '{}');
    const response = await route.fetch();
    const body = await response.json();
    let filteredProducts = body.data;

    if (
      requestBody.productCategory?.includes('electronics')
      || requestBody.productSubCategory?.includes('mobiles')
    ) {
      filteredProducts = body.data.filter(
        (product) => product.productName.toLowerCase() === 'iphone 13 pro',
      );
    } else if (requestBody.minPrice != null && requestBody.maxPrice != null) {
      filteredProducts = body.data.filter((product) => {
        const price = Number(product.productPrice);
        return price >= requestBody.minPrice && price <= requestBody.maxPrice;
      });
    }

    await route.fulfill({
      response,
      json: { ...body, data: filteredProducts, count: filteredProducts.length },
    });
  });
}

async function stubOrderHistory(world, deletable = false) {
  world.orderDeleted = false;
  world.deleteRequestUrl = '';

  await world.page.route('**/api/ecom/order/**', async (route) => {
    const requestUrl = route.request().url();
    if (requestUrl.includes('/get-orders-for-customer/')) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: world.orderDeleted ? [] : [mockOrder],
          count: world.orderDeleted ? 0 : 1,
          message: world.orderDeleted ? 'No Orders' : 'Orders fetched Successfully',
        }),
      });
      return;
    }

    if (deletable && requestUrl.toLowerCase().includes('delete')) {
      world.orderDeleted = true;
      world.deleteRequestUrl = requestUrl;
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Order Deleted Successfully' }),
      });
      return;
    }

    await route.continue();
  });
}

Given('a login to Ecommerce application with {string} and {string}', async function (username, password) {
  const loginPage = this.poManager.getLoginPage();
  this.cartPage = this.poManager.getCartPage();
  await loginPage.goto();
  await loginPage.validLogin(username, password);
});

When('I attempt to login with {string} and {string}', async function (username, password) {
  const loginPage = this.poManager.getLoginPage();
  await loginPage.goto();
  await loginPage.login(username, password);
});

When('Add {string} to the cart', { timeout: 30000 }, async function (productName) {
  const dashboardPage = this.poManager.getDashboardPage();
  const addToCartResponse = this.page.waitForResponse((response) => (
    response.url().includes('/api/ecom/user/add-to-cart')
    && response.request().method() === 'POST'
  ));
  await dashboardPage.SearchProduct(productName);
  await addToCartResponse;
  await expect(this.page.locator("[routerlink*='cart'] label")).not.toHaveText('0');
  await dashboardPage.navigateToCart();
});

When('I sign out', async function () {
  await this.page.getByRole('button', { name: /sign out/i }).click();
});

When('Proceed to checkout and fill the details with {string},{string},{string}', { timeout: 100000 }, async function (cardNumber, cvv, country) {
  await this.cartPage.enterDetails(cardNumber, cvv);
  await this.cartPage.addInfo(country);
});

Then('the product catalog is displayed', async function () {
  await this.page.locator('.card-body').first().waitFor({ state: 'visible' });
});

Then('each catalog product shows its name, price, and actions', async function () {
  const products = this.page.locator('.card-body');
  await expect(products).toHaveCount(3);

  for (const productName of ['ADIDAS ORIGINAL', 'ZARA COAT 3', 'IPHONE 13 PRO']) {
    const product = products.filter({ hasText: new RegExp(productName, 'i') }).first();
    await expect(product.locator('b')).toHaveText(new RegExp(productName, 'i'));
    await expect(product).toContainText('$');
    await expect(product.getByRole('button', { name: 'View' })).toBeVisible();
    await expect(product.getByRole('button', { name: 'Add To Cart' })).toBeVisible();
  }
});

When('I search the catalog for {string}', async function (searchTerm) {
  const search = this.page.locator('form:visible input[placeholder="search"]');
  await search.fill(searchTerm);
  await search.press('Enter');
});

Then('only {string} is shown in the catalog', async function (productName) {
  const products = this.page.locator('.card-body');
  await expect(products).toHaveCount(1);
  await expect(products.first()).toContainText(new RegExp(productName, 'i'));
});

Then('the no-products state is displayed', async function () {
  await expect(this.page.locator('.card-body')).toHaveCount(0);
  await expect(this.page.getByText('No Products Found', { exact: true })).toBeVisible();
});

When('I filter the catalog by category {string} and subcategory {string}', async function (category, subcategory) {
  await stubFilteredCatalog(this.page);
  const form = this.page.locator('form:visible');

  const categoryResponse = this.page.waitForResponse((response) => {
    if (!response.url().includes('/api/ecom/product/get-all-products')) {
      return false;
    }
    const body = JSON.parse(response.request().postData() || '{}');
    return body.productCategory?.includes(category);
  });
  await form.locator('.form-group').filter({ hasText: category }).locator('input').check();
  await categoryResponse;

  const subcategoryResponse = this.page.waitForResponse((response) => {
    if (!response.url().includes('/api/ecom/product/get-all-products')) {
      return false;
    }
    const body = JSON.parse(response.request().postData() || '{}');
    return body.productSubCategory?.includes(subcategory);
  });
  await form.locator('.form-group').filter({ hasText: subcategory }).locator('input').check();
  await subcategoryResponse;
});

When('I filter the catalog to prices between {string} and {string}', async function (minimum, maximum) {
  await stubFilteredCatalog(this.page);
  const minPrice = this.page.locator('form:visible input[placeholder="Min Price"]');
  const maxPrice = this.page.locator('form:visible input[placeholder="Max Price"]');
  await minPrice.fill(minimum);
  await maxPrice.fill(maximum);

  const priceResponse = this.page.waitForResponse((response) => {
    if (!response.url().includes('/api/ecom/product/get-all-products')) {
      return false;
    }
    const body = JSON.parse(response.request().postData() || '{}');
    return Number(body.minPrice) === Number(minimum) && Number(body.maxPrice) === Number(maximum);
  });
  await maxPrice.press('Enter');
  await priceResponse;
});

Then('products within that price range are shown', async function () {
  const products = this.page.locator('.card-body');
  await expect(products).toHaveCount(2);
  await expect(products.nth(0)).toContainText(/ADIDAS ORIGINAL/i);
  await expect(products.nth(1)).toContainText(/ZARA COAT 3/i);
});

When('I open the details for {string}', async function (productName) {
  await this.page.locator('.card-body').filter({ hasText: productName })
    .getByRole('button', { name: 'View' }).click();
});

Then('the product details show its name, price, and cart action', async function () {
  await expect(this.page.getByText('ZARA COAT 3', { exact: true })).toBeVisible();
  await expect(this.page.getByText('$ 11500', { exact: true })).toBeVisible();
  await expect(this.page.getByRole('button', { name: 'Add To Cart' })).toBeVisible();
});

When('I open the details for {string} and add it to the cart', { timeout: 30000 }, async function (productName) {
  await this.page.locator('.card-body').filter({ hasText: productName })
    .getByRole('button', { name: 'View' }).click();
  await expect(this.page.getByText(productName, { exact: true })).toBeVisible();
  const addToCartResponse = this.page.waitForResponse((response) => (
    response.url().includes('/api/ecom/user/add-to-cart')
    && response.request().method() === 'POST'
  ));
  await this.page.getByRole('button', { name: 'Add To Cart' }).click();
  await addToCartResponse;
  await expect(this.page.locator("[routerlink*='cart'] label")).not.toHaveText('0');
  await this.page.locator("[routerlink*='cart']").click();
});

When('I remove the product from the cart', async function () {
  await this.page.locator('button.btn-danger').click();
});

Then('the empty cart state is displayed and checkout is unavailable', async function () {
  await expect(this.page.getByText('No Products in Your Cart !', { exact: true })).toBeVisible();
  await expect(this.page.getByRole('button', { name: 'Checkout' })).toHaveCount(0);
});

When('I proceed to checkout', async function () {
  await this.page.getByRole('button', { name: 'Checkout' }).click();
});

Then('the checkout summary and payment fields are displayed', async function () {
  await expect(this.page.getByText('ZARA COAT 3', { exact: true })).toBeVisible();
  await expect(this.page.locator('.input.txt.text-validated').first()).toBeVisible();
  await expect(this.page.locator('input[placeholder="Select Country"]')).toBeVisible();
});

Given('a deterministic test order is returned by order history', async function () {
  await stubOrderHistory(this);
});

Given('a deterministic deletable order is returned by order history', async function () {
  await stubOrderHistory(this, true);
});

When('I open the orders page', async function () {
  await this.page.goto('https://rahulshettyacademy.com/client/#/dashboard/myorders');
});

Then('the deterministic test order and its actions are displayed', async function () {
  const row = this.page.locator('tbody tr').filter({ hasText: mockOrder.productName });
  await expect(row).toHaveCount(1);
  await expect(row.locator('th')).toContainText(mockOrderId);
  await expect(row.getByRole('button', { name: 'View' })).toBeVisible();
  await expect(row.getByRole('button', { name: 'Delete' })).toBeVisible();
});

When('I delete the deterministic test order', async function () {
  const row = this.page.locator('tbody tr').filter({ hasText: mockOrder.productName });
  await row.getByRole('button', { name: 'Delete' }).click();
});

Then('the test order is removed and the delete request was intercepted', async function () {
  await expect(this.page.locator('tbody tr')).toHaveCount(0);
  assert.ok(this.deleteRequestUrl.includes(mockOrderId), 'The test order delete request was not intercepted.');
});

When('I open the cart', async function () {
  await this.page.locator("[routerlink*='cart']").click();
});

Given('order submissions are intercepted', async function () {
  this.orderRequestIntercepted = false;
  await this.page.route('**/api/ecom/order/create-order', async (route) => {
    this.orderRequestIntercepted = true;
    await route.abort();
  });
});

When('I submit invalid payment details and select {string}', { timeout: 60000 }, async function (country) {
  await this.page.getByRole('button', { name: 'Checkout' }).click();
  await this.page.locator('.input.txt.text-validated').first().fill('123');
  await this.page.locator("//div[@class='payment__cc']//div[2]//input[1]").fill('invalid');

  const countryInput = this.page.locator('input[placeholder="Select Country"]');
  await countryInput.pressSequentially(country.slice(0, 3), { delay: 100 });
  const options = this.page.locator('.ta-results button');
  await options.first().waitFor({ state: 'visible' });
  const labels = await options.allTextContents();
  const countryIndex = labels.findIndex((label) => label.trim() === country);
  if (countryIndex === -1) {
    throw new Error(`Country option "${country}" was not found.`);
  }
  await options.nth(countryIndex).click();
  await this.page.locator('.btnn').click();
});

Then('the order request error is displayed without placing an order', async function () {
  await expect(this.page.getByText('Unknown error occured', { exact: true })).toBeVisible();
  assert.equal(this.orderRequestIntercepted, true);
  await expect(this.page.getByText(/Order Placed Successfully/i)).toHaveCount(0);
});

When('I refresh the current page', async function () {
  await this.page.reload();
});

Then('an authentication error is displayed', async function () {
  const errorMessage = this.page.locator('.toast-message');
  await errorMessage.waitFor({ state: 'visible' });
  const message = (await errorMessage.textContent())?.trim() ?? '';
  assert.match(message, /invalid|incorrect|wrong|fail/i);
  assert.match(this.page.url(), /auth\/login/);
});

Then('I am returned to the login page', async function () {
  await this.page.locator('#userEmail').waitFor({ state: 'visible' });
});

Then('{string} is visible in the cart', { timeout: 30000 }, async function (productName) {
  await this.page.locator('h3').filter({ hasText: productName }).waitFor({ state: 'visible' });
});

Then('Verify the order is placed successfully', async function () {
  const confirmation = this.page.locator('label.ng-star-inserted');
  await confirmation.waitFor({ state: 'visible' });
  const orderId = (await confirmation.textContent())?.trim();
  assert.ok(orderId, 'The order confirmation did not include an order ID.');

  await this.page.locator("button[routerlink*='myorders']").click();
  await this.page.locator('tbody').first().waitFor({ state: 'visible' });
  const rows = this.page.locator('tbody tr');
  let orderFound = false;

  for (let index = 0; index < await rows.count(); index++) {
    const rowOrderId = (await rows.nth(index).locator('th').textContent())?.trim();
    if (rowOrderId && orderId.includes(rowOrderId)) {
      orderFound = true;
      break;
    }
  }

  assert.ok(orderFound, `Order ${orderId} was not found in order history.`);
});
