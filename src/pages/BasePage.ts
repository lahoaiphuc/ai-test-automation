import { expect, type Locator, type Page } from '@playwright/test';

/**
 * Lớp cha cho mọi Page Object.
 *
 * Vai trò:
 *  - Giữ tham chiếu `page`.
 *  - Cung cấp các wrapper mỏng, đặt tên rõ nghĩa quanh Playwright Locator API.
 *  - KHÔNG dùng page.waitForTimeout(): mọi wrapper dựa trên auto-waiting của
 *    Locator (Playwright tự chờ element hiển thị / actionable).
 */
export abstract class BasePage {
  protected constructor(protected readonly page: Page) {}

  /* ----------------------- Navigation ----------------------- */

  /** Điều hướng tới path tương đối so với baseURL. */
  protected async goto(pathname: string): Promise<void> {
    await this.page.goto(pathname, { waitUntil: 'domcontentloaded' });
  }

  async reload(): Promise<void> {
    await this.page.reload();
  }

  async goBack(): Promise<void> {
    await this.page.goBack();
  }

  getUrl(): string {
    return this.page.url();
  }

  /* --------------------- Common actions --------------------- */

  /** Click an toàn – Locator tự chờ element visible & enabled. */
  protected async click(locator: Locator): Promise<void> {
    await locator.click();
  }

  /** Xóa nội dung cũ rồi nhập giá trị mới. */
  protected async fill(locator: Locator, value: string): Promise<void> {
    await locator.fill(value);
  }

  /** Gõ tuần tự từng phím (dùng khi field có xử lý keystroke / autocomplete). */
  protected async pressSequentially(locator: Locator, value: string): Promise<void> {
    await locator.pressSequentially(value);
  }

  protected async setChecked(locator: Locator, checked: boolean): Promise<void> {
    await locator.setChecked(checked);
  }

  protected async getText(locator: Locator): Promise<string> {
    return (await locator.textContent())?.trim() ?? '';
  }

  protected async getAttribute(locator: Locator, name: string): Promise<string | null> {
    return locator.getAttribute(name);
  }

  /* --------------------- Assert helpers --------------------- */

  /** Chờ & khẳng định element hiển thị (web-first assertion, auto-retry). */
  protected async expectVisible(locator: Locator): Promise<void> {
    await expect(locator).toBeVisible();
  }

  protected async expectText(locator: Locator, expected: string | RegExp): Promise<void> {
    await expect(locator).toHaveText(expected);
  }

  async expectUrl(pattern: RegExp): Promise<void> {
    await expect(this.page).toHaveURL(pattern);
  }

  async expectTitle(pattern: string | RegExp): Promise<void> {
    await expect(this.page).toHaveTitle(pattern);
  }
}
