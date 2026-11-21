# Playwright Automation

A browser-automation learning project using Playwright and Cucumber. Playwright tests and examples are organized into parallel JavaScript and TypeScript folders; the Cucumber suite describes user journeys in Gherkin.

## Requirements

- Node.js 20, 22, or 24+
- npm
- Internet access to the demo websites used by the tests

## Setup

From the repository root, install project dependencies and the Chromium browser:

```bash
npm ci
npx playwright install chromium
```

## Run tests

Run both language suites:

```bash
npm test
```

Run only one language suite:

```bash
npm run test:js
npm run test:ts
```

The default configuration opens Chromium in a visible window. Tests run one at a time because several use shared public demo accounts:

```bash
npm test -- --workers=1
```

Run one spec from its language project:

```bash
npx playwright test tests/javascript/ecommerce-order-placement.spec.js --project=javascript
npx playwright test tests/typescript/ecommerce-order-placement.spec.ts --project=typescript
```

Other useful commands:

| Command | What it runs |
| --- | --- |
| `npm run regression` | The full Playwright suite; currently the same as `npm test`. |
| `npm run web-test` | Playwright tests tagged `@web`. |
| `npm run cucumber` | All scenarios in `features/Ecommerce.feature`. |
| `npx playwright show-report` | Opens the most recent Playwright HTML report, if one was generated. |

Playwright screenshots and traces are collected for failed tests. The HTML report is written to `playwright-report/`; Cucumber writes `cucumber-report.html`.

Playwright tests are maintained in matching JavaScript and TypeScript folders. `npm test` currently discovers 66 tests across both projects. Both folders also contain language-specific demos.

## Cucumber scenarios

Run the 18 e-commerce scenarios with `npm run cucumber`. Coverage includes authentication, catalog search and filters, product details and cart actions, checkout, order history and deletion, empty-cart handling, invalid-payment feedback, and navigation resilience.

The feature is in `features/Ecommerce.feature`; reusable step code is in `features/step_definitions/steps.js`, and browser setup/cleanup is in `features/support/hooks.js`.

## Project layout

- `tests/javascript/` — JavaScript Playwright specs, examples, and helper.
- `tests/typescript/` — Matching TypeScript specs, examples, and typed helper.
- `features/` — Cucumber feature, step definitions, and support hooks.
- `page-objects/javascript/` — JavaScript page objects.
- `page-objects/typescript/` — TypeScript page objects.
- `test-utilities/javascript/` — JavaScript API helper used by the API specs.
- `test-utilities/shared/` — Order test data used by both language suites.
- `.github/agents/` — Optional Copilot agents for test planning, generation, and debugging.
- `.github/workflows/` — GitHub Actions workflow definitions.
- `playwright.config.js` — Local Chromium settings, JavaScript/TypeScript test projects, timeouts, and reporting.
- `playwright.service.config.js` — Optional Azure Playwright service configuration.

Authenticated Playwright tests create `state.json` to reuse browser login state. It contains session data, is ignored by Git, and should not be shared or committed.

## Azure-hosted CI

The GitHub Actions workflow in `.github/workflows/playwright.yml` runs on pushes and pull requests targeting `main` or `master`, every Monday at 03:00 UTC (08:30 IST), and can also be started manually with **Run workflow**. The Azure-hosted job currently runs `tests/javascript/google-and-otp-signup.spec.js`; it does not run the full local Playwright suite.

Before the Azure job can run, configure these in the repository's **Settings → Secrets and variables → Actions**:

- Secret `AZURE_CREDS`: Azure service-principal credentials in the format expected by `azure/login`.
- Variable `PLAYWRIGHT_SERVICE_URL`: the connection URL for the Azure Playwright service.

Scheduled workflows run from the repository's default branch. The workflow file must be present on that branch for the weekly schedule to take effect.

## Notes for contributors

- These tests use public demo applications, so network availability or changes to those sites can affect results.
- The public e-commerce demo currently returns unfiltered results for category and price filters, and submits invalid payment values to its order API. The filter specs stub the filtered response, while validation specs intercept the request to avoid creating an order.
- Use dedicated test accounts only. Keep real passwords and personal credentials out of source control.
- The Excel tests use a temporary file by default; set `EXCEL_TEST_FILE` if you want to use another path.
- The Azure service configuration requires the service URL and Azure credentials to be provided through environment variables/secrets.
