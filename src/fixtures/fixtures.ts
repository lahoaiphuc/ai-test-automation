import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';

/**
 * Custom fixtures.
 * Mỗi Page Object được khởi tạo 1 lần / test và tự hủy sau khi test kết thúc,
 * nên spec không cần `new` thủ công hay lặp lại beforeEach.
 */
type PageObjects = {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
};

type AuthFixtures = {
  /** DashboardPage ở trạng thái đã đăng nhập sẵn bằng tài khoản mặc định (ENV). */
  authedDashboard: DashboardPage;
};

export const test = base.extend<PageObjects & AuthFixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.open(); // Setup: luôn mở sẵn trang login
    await use(loginPage);
  },

  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },

  authedDashboard: async ({ loginPage, dashboardPage }, use) => {
    await loginPage.loginAsDefaultUser();
    await dashboardPage.expectLoaded();
    await use(dashboardPage);
  },
});

/** Re-export expect để spec chỉ cần import từ 1 chỗ. */
export { expect } from '@playwright/test';
