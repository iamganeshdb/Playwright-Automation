# PriceLabs Playwright Automation Assignment

## Prerequisites

* Node.js installed
* npm installed

Setup :

Install project dependencies:
npm install


Install Playwright browsers:
npx playwright install


Execute tests :

Run all tests:
npx playwright test


Run a specific test:
npx playwright test tests/MinandMaxPrice.spec.js


Run in headed mode:
npx playwright test --headed


Generate and View Reports:
npx playwright show-report


Project Structure:

* tests/MinandMaxPrice.spec.js - Playwright test cases
* tests/FixPrice.spec.js - Playwright test cases
* tests/BillingsDetails - Billing page is protected by Cloudflare Turnstile. 
This is an infrastructure-level bot protection that might not be bypassed via automation tools. In a real project, this would be resolved by disabling bot protection on staging . All other test cases are fully automated.
* playwright.config.js - Playwright configuration
* package.json - Project dependencies
* README.md - Execution instructions


