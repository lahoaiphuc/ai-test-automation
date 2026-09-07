import { type Locator, type Page } from '@playwright/test';
import { BasePage } from './BasePage';

/** Page Object cho màn hình sau khi đăng nhập thành công (Admin Dashboard). */
export class DashboardPage extends BasePage {
  /** Nút mở dropdown hồ sơ người dùng ở góc trên bên phải. */
  private readonly profileMenuToggle: Locator;
  /** Link "Logout" nằm trong dropdown hồ sơ (phân biệt với template ẩn cùng href). */
  private readonly logoutLink: Locator;

  constructor(page: Page) {
    super(page);
    this.profileMenuToggle = page.locator('.header-user-profile a.dropdown-toggle');
    this.logoutLink = page.getByRole('link', { name: 'Logout', exact: true });
  }

  /** Khẳng định đã vào được khu vực admin. */
  async expectLoaded(): Promise<void> {
    await this.expectUrl(/\/admin\/?$/);
    await this.expectTitle(/dashboard/i);
  }

  /** Mở dropdown hồ sơ rồi bấm Logout. */
  async logout(): Promise<void> {
    await this.click(this.profileMenuToggle.first());
    await this.click(this.logoutLink);
  }
}
