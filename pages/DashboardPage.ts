import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class DashboardPage extends BasePage {
  readonly logoutLink: Locator;

  constructor(page: Page) {
    super(page);
    this.logoutLink = page.locator('a[href*="authentication/logout"]');
  }

  async isLoaded(): Promise<boolean> {
    await this.page.waitForURL(/\/admin\/?$/, { timeout: 10_000 });
    return this.page.url().includes('/admin');
  }

  async logout(): Promise<void> {
    await this.logoutLink.click();
  }
}
