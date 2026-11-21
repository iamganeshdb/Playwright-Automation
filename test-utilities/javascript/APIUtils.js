class APIUtils {
  constructor(apiContext, loginPayload) {
    this.apiContext = apiContext;
    this.loginPayload = loginPayload;
  }

  async getToken() {
    const loginResponse = await this.apiContext.post(
      'https://rahulshettyacademy.com/api/ecom/auth/login',
      { data: this.loginPayload },
    );
    if (!loginResponse.ok()) {
      throw new Error(`Login API returned ${loginResponse.status()}.`);
    }

    const loginResponseJson = await loginResponse.json();
    if (!loginResponseJson.token) {
      throw new Error('Login API response did not contain a token.');
    }
    return loginResponseJson.token;
  }

  async createOrder(orderPayload) {
    const token = await this.getToken();
    const orderResponse = await this.apiContext.post(
      'https://rahulshettyacademy.com/api/ecom/order/create-order',
      {
        data: orderPayload,
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
      },
    );
    if (!orderResponse.ok()) {
      throw new Error(`Create order API returned ${orderResponse.status()}.`);
    }

    const orderResponseJson = await orderResponse.json();
    const orderId = orderResponseJson.orders?.[0];
    if (!orderId) {
      throw new Error('Create order API response did not contain an order ID.');
    }
    return { token, orderId };
  }
}

module.exports = { APIUtils };
