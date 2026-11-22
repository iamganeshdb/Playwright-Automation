// Provides typed API helpers for authenticating and creating an order.
import type { APIRequestContext } from '@playwright/test';

export interface LoginPayload {
  userEmail: string;
  userPassword: string;
}

export interface OrderPayload {
  orders: Array<{
    country: string;
    productOrderedId: string;
  }>;
}

export interface CreatedOrder {
  token: string;
  orderId: string;
}

export class ApiTestUtils {
  constructor(
    private readonly apiContext: APIRequestContext,
    private readonly loginPayload: LoginPayload,
  ) {}

  async getToken(): Promise<string> {
    const response = await this.apiContext.post(
      'https://rahulshettyacademy.com/api/ecom/auth/login',
      { data: this.loginPayload },
    );
    if (!response.ok()) {
      throw new Error(`Login API returned ${response.status()}.`);
    }

    const result = await response.json() as { token?: string };
    if (!result.token) {
      throw new Error('Login API response did not contain a token.');
    }
    return result.token;
  }

  async createOrder(orderPayload: OrderPayload): Promise<CreatedOrder> {
    const token = await this.getToken();
    const response = await this.apiContext.post(
      'https://rahulshettyacademy.com/api/ecom/order/create-order',
      {
        data: orderPayload,
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
      },
    );
    if (!response.ok()) {
      throw new Error(`Create order API returned ${response.status()}.`);
    }

    const result = await response.json() as { orders?: string[] };
    const orderId = result.orders?.[0];
    if (!orderId) {
      throw new Error('Create order API response did not contain an order ID.');
    }
    return { token, orderId };
  }
}
