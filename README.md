# CRM Login Automation

Playwright + TypeScript automation framework using the Page Object Model, targeting the login flow at:

```
https://crm.anhtester.com/admin/authentication
```

## Structure

```
pages/            Page Object classes (BasePage, LoginPage, DashboardPage)
fixtures/         Custom Playwright fixtures that inject page objects into tests
test-data/        Test credentials (reads from .env, falls back to defaults)
tests/            Spec files
playwright.config.ts
.env              Local config (base URL + credentials) - not committed
```

## Setup

```bash
npm install
npx playwright install
```

Copy `.env.example` to `.env` and adjust credentials if needed:

```bash
cp .env.example .env
```

## Run tests

```bash
npm test               # headless, all browsers (chromium/firefox/webkit)
npm run test:headed    # headed mode
npm run test:ui        # Playwright UI mode
npx playwright test --project=chromium   # single browser
npm run report         # open the last HTML report
```

## Covered scenarios (tests/login.spec.ts)

- Successful login with valid credentials, redirect to the dashboard
- Error message on an incorrect password
- Error message on an unregistered email
- Submitting the form with empty fields keeps the user on the login page

## Notes

- Credentials are read from environment variables (`VALID_EMAIL`, `VALID_PASSWORD`) via `test-data/credentials.ts`, so CI can inject secrets instead of committing them.
- `playwright.config.ts` enables trace/video/screenshot capture on failure for easier debugging.
