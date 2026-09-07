import { type Locator, type Page } from '@playwright/test';
import { ENV } from '../../configs/env.config';
import { BasePage } from './BasePage';

/**
 * Page Object cho màn hình đăng nhập CRM.
 * URL: {baseURL}{LOGIN_PATH}  (mặc định /admin/authentication)
 *
 * Ưu tiên locator: getByTestId > getByRole / getByLabel > id ổn định.
 * Form hiện tại của site dùng id cố định (#email, #password) nên tạm dùng id,
 * kèm ghi chú để chuyển sang data-testid khi dev bổ sung.
 */
export class LoginPage extends BasePage {
  private readonly emailInput: Locator;
  private readonly passwordInput: Locator;
  private readonly rememberMeCheckbox: Locator;
  private readonly submitButton: Locator;
  private readonly errorAlert: Locator;

  constructor(page: Page) {
    super(page);
    this.emailInput = page.locator('#email');
    this.passwordInput = page.locator('#password');
    this.rememberMeCheckbox = page.locator('#remember');
    // Nút submit lấy theo role + type -> không phụ thuộc text hiển thị.
    this.submitButton = page.locator('button[type="submit"]');
    this.errorAlert = page.locator('#alerts .alert-danger');
  }

  /* --------------------------- Actions --------------------------- */

  /** Mở trang login và chờ form sẵn sàng. */
  async open(): Promise<void> {
    await this.goto(ENV.loginPath);
    await this.expectVisible(this.emailInput);
  }

  async enterEmail(email: string): Promise<void> {
    await this.fill(this.emailInput, email);
  }

  async enterPassword(password: string): Promise<void> {
    await this.fill(this.passwordInput, password);
  }

  async submit(): Promise<void> {
    await this.click(this.submitButton);
  }

  /**
   * Đăng nhập đầy đủ luồng. Nếu tham số là chuỗi rỗng thì bỏ qua field đó
   * (phục vụ các case "bỏ trống field").
   */
  async login(email: string, password: string, rememberMe = false): Promise<void> {
    if (email !== '') await this.enterEmail(email);
    if (password !== '') await this.enterPassword(password);
    if (rememberMe) await this.setChecked(this.rememberMeCheckbox, true);
    await this.submit();
  }

  /** Đăng nhập bằng tài khoản hợp lệ lấy từ ENV (dùng cho fixture auth). */
  async loginAsDefaultUser(): Promise<void> {
    await this.login(ENV.credentials.username, ENV.credentials.password);
  }

  /* ------------------------- Verifications ------------------------ */

  async getErrorMessage(): Promise<string> {
    await this.expectVisible(this.errorAlert);
    return this.getText(this.errorAlert);
  }

  /** Kiểu của ô password – dùng để verify mật khẩu bị che (TC_LOGIN_025). */
  async getPasswordFieldType(): Promise<string | null> {
    return this.getAttribute(this.passwordInput, 'type');
  }

  /** Expose cho spec dùng web-first assertion trực tiếp. */
  get error(): Locator {
    return this.errorAlert;
  }

  async expectStillOnLoginPage(): Promise<void> {
    await this.expectUrl(new RegExp(`${ENV.loginPath}$`));
  }
}
