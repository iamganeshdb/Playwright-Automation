const { POManager } = require('../../page-objects/javascript/POManager.js');
const{chromium} = require('playwright');
const {Before,After,AfterStep,Status} = require('@cucumber/cucumber');


Before(async function () {
  this.browser = await chromium.launch();
        const context = await this.browser.newContext();
        this.page = await context.newPage();//By adding this scope will not end in method instead it will be stored in world constructor available for all the methods in this class
        this.poManager = new POManager(this.page);
});

After(async function () {
    await this.browser.close();
});


AfterStep( async function ({result}) {
  // This hook will be executed after all steps, and take a screenshot on step failures
  if (result.status === Status.FAILED) {
    await this.page.screenshot({ path: 'screenshot1.png' });
  }
});