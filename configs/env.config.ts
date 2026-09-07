import * as fs from 'node:fs';
import * as path from 'node:path';
import * as dotenv from 'dotenv';

/**
 * Chọn file .env theo TEST_ENV (mặc định 'dev').
 * Thứ tự ưu tiên:  biến môi trường có sẵn (CI)  >  .env.<env>  >  .env
 */
const TEST_ENV = process.env.TEST_ENV ?? 'dev';

const candidate = path.resolve(process.cwd(), `.env.${TEST_ENV}`);
const fallback = path.resolve(process.cwd(), '.env');
const envPath = fs.existsSync(candidate) ? candidate : fallback;

dotenv.config({ path: envPath });

/** Bắt buộc phải có giá trị – fail sớm ngay khi khởi động thay vì lỗi mơ hồ giữa chừng. */
function required(key: string): string {
  const value = process.env[key];
  if (value === undefined || value.trim() === '') {
    throw new Error(
      `[env.config] Thiếu biến môi trường bắt buộc: "${key}" (đã đọc từ: ${envPath}). ` +
        `Hãy chạy: cp .env.example .env`,
    );
  }
  return value.trim();
}

/** Cấu hình đã kiểm tra kiểu – import object này ở mọi nơi thay cho process.env. */
export const ENV = {
  name: TEST_ENV,
  baseURL: required('BASE_URL'),
  loginPath: process.env.LOGIN_PATH ?? '/admin/authentication',
  credentials: {
    username: required('APP_USERNAME'),
    password: required('APP_PASSWORD'),
  },
  debugLog: process.env.DEBUG_LOG === 'true',
} as const;

export type AppEnv = typeof ENV;
