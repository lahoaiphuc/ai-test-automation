import { test, expect } from '../fixtures/pages.fixture';
import { credentials } from '../test-data/credentials';

test.describe('CRM Login - https://crm.anhtester.com/admin/authentication', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.open();
  });

  test('logs in successfully with valid credentials', async ({ loginPage, dashboardPage, page }) => {
    await loginPage.login(credentials.valid.email, credentials.valid.password);

    await expect(async () => {
      expect(await dashboardPage.isLoaded()).toBeTruthy();
    }).toPass();
    await expect(page).toHaveTitle('Dashboard');
    await expect(page).toHaveURL(/\/admin\/?$/);
  });

  test('shows an error with an incorrect password', async ({ loginPage }) => {
    await loginPage.login(credentials.valid.email, credentials.invalid.password);

    await expect(loginPage.errorAlert).toBeVisible();
    expect(await loginPage.getErrorMessage()).toBe('Invalid email or password');
    await expect(loginPage.page).toHaveURL(/\/admin\/authentication$/);
  });

  test('shows an error with an unregistered email', async ({ loginPage }) => {
    await loginPage.login(credentials.invalid.email, credentials.invalid.password);

    await expect(loginPage.errorAlert).toBeVisible();
    expect(await loginPage.getErrorMessage()).toBe('Invalid email or password');
  });

  test('keeps the user on the login page when submitting empty credentials', async ({ loginPage, page }) => {
    await loginPage.submit();

    await expect(page).toHaveURL(/\/admin\/authentication$/);
    await expect(page).toHaveTitle(/Login/);
    await expect(loginPage.emailInput).toBeVisible();
  });
});
