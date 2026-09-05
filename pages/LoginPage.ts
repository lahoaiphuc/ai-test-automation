import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

const LOGIN_PATH = process.env.LOGIN_PATH ?? '/admin/authentication';

export class LoginPage extends BasePage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly rememberMeCheckbox: Locator;
  readonly loginButton: Locator;
  readonly forgotPasswordLink: Locator;
  readonly errorAlert: Locator;

  constructor(page: Page) {
    super(page);
    this.emailInput = page.locator('#email');
    this.passwordInput = page.locator('#password');
    this.rememberMeCheckbox = page.locator('#remember');
    this.loginButton = page.locator('button[type="submit"]');
    this.forgotPasswordLink = page.getByRole('link', { name: 'Forgot Password?' });
    this.errorAlert = page.locator('#alerts .alert-danger');
  }

  async open(): Promise<void> {
    await this.goto(LOGIN_PATH);
  }

  async fillEmail(email: string): Promise<void> {
    await this.emailInput.fill(email);
  }

  async fillPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
  }

  async submit(): Promise<void> {
    await this.loginButton.click();
  }

  async login(email: string, password: string, rememberMe = false): Promise<void> {
    await this.fillEmail(email);
    await this.fillPassword(password);
    if (rememberMe) {
      await this.rememberMeCheckbox.check();
    }
    await this.submit();
  }

  async getErrorMessage(): Promise<string> {
    return (await this.errorAlert.textContent())?.trim() ?? '';
  }
}
