import { defineConfig, devices } from '@playwright/test';
import { ENV } from './configs/env.config';

/**
 * Cấu hình trung tâm của Playwright Test.
 * Mọi giá trị phụ thuộc môi trường đều lấy từ `ENV` (configs/env.config.ts),
 * không hardcode URL / credential ở đây.
 */
export default defineConfig({
  testDir: './tests',
  outputDir: './test-results',

  /* --- Timeout --- */
  timeout: 45_000, // Ngân sách thời gian cho mỗi test
  expect: { timeout: 10_000 }, // Ngân sách cho mỗi web-first assertion (auto-retry)

  /* --- Ổn định & song song --- */
  fullyParallel: true, // Chạy song song cả trong cùng 1 file
  forbidOnly: !!process.env.CI, // Chặn test.only lọt vào CI
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 3 : '50%', // Local: dùng 50% số CPU core; CI: cố định 3

  /* --- Reporters --- */
  reporter: [
    ['list'],
    ['html', { outputFolder: 'reports/html', open: 'never' }],
    ['junit', { outputFile: 'reports/junit/results.xml' }],
  ],

  /* --- Mặc định cho mọi test --- */
  use: {
    baseURL: ENV.baseURL,
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    testIdAttribute: 'data-testid',
  },

  /* --- Đa trình duyệt --- */
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});
