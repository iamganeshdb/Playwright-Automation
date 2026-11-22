// Provides typed helpers and deterministic order data for the e-commerce specs.
import type { Page } from '@playwright/test';

interface OrderFixture {
  userName: string;
  passWord: string;
  productName: string;
  country: string;
}

interface CatalogProduct {
  productName: string;
  productPrice: number | string;
}

interface FilterRequest {
  productName?: string;
  minPrice?: number | null;
  maxPrice?: number | null;
  productCategory?: string[];
  productSubCategory?: string[];
}

const orderData = (require('../shared/placeOrder.json') as OrderFixture[])
  .find(({ productName }) => productName === 'ZARA COAT 3');

export const mockOrderId = 'test-order-id-000000000001';
export const mockOrder = {
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

export async function login(page: Page): Promise<void> {
  if (!orderData) {
    throw new Error('ZARA COAT 3 order test data is missing.');
  }

  await page.goto('https://rahulshettyacademy.com/client/#/auth/login');
  await page.locator('#userEmail').fill(orderData.userName);
  await page.locator('#userPassword').fill(orderData.passWord);
  await page.locator('#login').click();
  await page.locator('.card-body').first().waitFor({ state: 'visible', timeout: 30000 });
}

export async function addToCart(page: Page, productName = 'ZARA COAT 3'): Promise<void> {
  const product = page.locator('.card-body').filter({ hasText: productName }).first();
  await product.getByRole('button', { name: 'Add To Cart' }).click();
}

export async function selectCountry(page: Page, country: string): Promise<void> {
  const countryInput = page.locator('input[placeholder="Select Country"]');
  await countryInput.pressSequentially(country.slice(0, 3), { delay: 100 });

  const options = page.locator('.ta-results button');
  await options.first().waitFor({ state: 'visible' });
  const labels = await options.allTextContents();
  const optionIndex = labels.findIndex((label) => label.trim() === country);
  if (optionIndex === -1) {
    throw new Error(`Country option "${country}" was not found.`);
  }
  await options.nth(optionIndex).click();
}

export async function stubOrderHistory(page: Page): Promise<void> {
  await page.route(
    '**/api/ecom/order/get-orders-for-customer/**',
    (route) => route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ data: [mockOrder], count: 1, message: 'Orders fetched Successfully' }),
    }),
  );
}

export async function stubFilteredCatalog(page: Page): Promise<void> {
  await page.route('**/api/ecom/product/get-all-products', async (route) => {
    const requestBody = JSON.parse(route.request().postData() || '{}') as FilterRequest;
    const response = await route.fetch();
    const body = await response.json() as { data: CatalogProduct[]; [key: string]: unknown };
    let filteredProducts = body.data;

    if (
      requestBody.productCategory?.includes('electronics')
      || requestBody.productSubCategory?.includes('mobiles')
    ) {
      filteredProducts = body.data.filter(
        (product) => product.productName.toLowerCase() === 'iphone 13 pro',
      );
    } else if (requestBody.minPrice != null && requestBody.maxPrice != null) {
      const { minPrice, maxPrice } = requestBody;
      if (minPrice == null || maxPrice == null) {
        await route.fulfill({ response, json: body });
        return;
      }
      filteredProducts = body.data.filter((product) => {
        const price = Number(product.productPrice);
        return price >= minPrice && price <= maxPrice;
      });
    }

    await route.fulfill({
      response,
      json: { ...body, data: filteredProducts, count: filteredProducts.length },
    });
  });
}
