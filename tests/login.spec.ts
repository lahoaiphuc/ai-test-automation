import { test, expect } from '../src/fixtures/fixtures';
import { ENV } from '../configs/env.config';
import { readJsonData } from '../src/utils/json-reader';

/* ----------------------------- Kiểu dữ liệu test ---------------------------- */
type InvalidCredential = {
  caseName: string;
  email: string;
  password: string;
  expectedError: string;
};
type BlockedSubmission = { caseName: string; email: string; password: string };
type SecurityPayload = { caseName: string; email: string; password: string };
type LoginData = {
  invalidCredentials: InvalidCredential[];
  blockedSubmissions: BlockedSubmission[];
  securityPayloads: SecurityPayload[];
};

const data = readJsonData<LoginData>('login.data.json');

test.describe('CRM - Đăng nhập @regression', () => {
  /* ====================================================================== */
  /* HAPPY PATH                                                             */
  /* ====================================================================== */
  test('TC_LOGIN_001 - đăng nhập thành công với tài khoản hợp lệ @smoke', async ({
    loginPage,
    dashboardPage,
  }) => {
    // Credential lấy từ ENV, không hardcode trong test
    await loginPage.login(ENV.credentials.username, ENV.credentials.password);
    await dashboardPage.expectLoaded();
  });

  /* ====================================================================== */
  /* NEGATIVE - SAI CREDENTIAL (data-driven)                               */
  /* ====================================================================== */
  for (const item of data.invalidCredentials) {
    test(`hiển thị lỗi khi ${item.caseName}`, async ({ loginPage }) => {
      await loginPage.login(item.email, item.password);

      await expect(loginPage.error).toBeVisible();
      expect(await loginPage.getErrorMessage()).toContain(item.expectedError);
      await loginPage.expectStillOnLoginPage();
    });
  }

  /* ====================================================================== */
  /* NEGATIVE - SUBMIT BỊ CHẶN: email sai format / bỏ trống field           */
  /* ====================================================================== */
  for (const item of data.blockedSubmissions) {
    test(`không đăng nhập được khi ${item.caseName}`, async ({ loginPage }) => {
      await loginPage.login(item.email, item.password);

      // Dù chặn ở client (HTML5 validation) hay server, kết quả chung: vẫn ở trang login
      await loginPage.expectStillOnLoginPage();
    });
  }

  /* ====================================================================== */
  /* SECURITY                                                              */
  /* ====================================================================== */
  for (const item of data.securityPayloads) {
    test(`chống tấn công: ${item.caseName}`, async ({ loginPage }) => {
      await loginPage.login(item.email, item.password);

      // Không bypass được đăng nhập, app không vỡ (vẫn ở trang login)
      await loginPage.expectStillOnLoginPage();
    });
  }

  test('TC_LOGIN_025 - password được che (type=password)', async ({ loginPage }) => {
    await loginPage.enterPassword('SuperSecret_123');
    expect(await loginPage.getPasswordFieldType()).toBe('password');
  });

  /* ====================================================================== */
  /* SESSION                                                              */
  /* ====================================================================== */
  test('TC_LOGIN_041 - truy cập trang admin khi chưa đăng nhập thì bị đẩy về login', async ({
    loginPage,
    page,
  }) => {
    await page.goto('/admin');
    await loginPage.expectStillOnLoginPage();
  });

  test('TC_LOGIN_042 - sau khi logout, nhấn Back không vào lại được khu vực nội bộ', async ({
    authedDashboard,
    loginPage,
  }) => {
    await authedDashboard.logout();
    await loginPage.expectStillOnLoginPage();

    await loginPage.goBack();
    await loginPage.expectStillOnLoginPage();
  });
});
