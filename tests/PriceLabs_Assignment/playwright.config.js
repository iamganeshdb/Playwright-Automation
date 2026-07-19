const config = {
  testDir: './tests',

  timeout: 400 * 1000,

  expect: {
    timeout: 4000,
  },

  reporter: 'html',

  use: {
    browserName: 'chromium',
    headless: false,
    screenshot: 'on',
    trace: 'on',
  },
};

module.exports = config;