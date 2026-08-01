const { POManager } = require('../../PageObject.js/POManager.js');
const{chromium} = require('playwright');
const {Before,After,BeforeStep,AfterStep,Status} = require('@cucumber/cucumber');


Before(async function () {
  const browser = await chromium.launch();
        const context = await browser.newContext();
        this.page = await context.newPage();//By adding this scope will not end in method instead it will be stored in world constructor available for all the methods in this class
        this.poManager = new POManager(this.page);
});

After(async function () {
    await this.browser.close();
});


BeforeStep(function () {
  // This hook will be executed before all steps in a scenario with tag @foo
});

AfterStep( async function ({result}) {
  // This hook will be executed after all steps, and take a screenshot on step failures
  if (result.status === Status.FAILED) {
    await this.page.screenshot({ path: 'screenshot1.png' });
  }
});