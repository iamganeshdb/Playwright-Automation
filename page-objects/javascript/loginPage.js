class loginPage {
  constructor(page) {
    this.page = page;
    this.signIn = page.locator('#login');
    this.userName = page.locator('#userEmail');
    this.passWord = page.locator('#userPassword');
  }

  async goto() {
    await this.page.goto('https://rahulshettyacademy.com/client/#/auth/login');
  }

  async login(userName, passWord) {
    await this.userName.fill(userName);
    await this.passWord.fill(passWord);
    await this.signIn.click();
  }

  async validLogin(userName, passWord) {
    await this.login(userName, passWord);
    await this.page.locator('.card-body').first().waitFor({ state: 'visible', timeout: 30000 });
  }
}

module.exports = { loginPage };