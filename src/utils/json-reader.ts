import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

/**
 * Đọc file JSON trong thư mục /data và ép kiểu về generic T.
 * Dùng fs thay vì `import` trực tiếp để đổi dữ liệu test không cần build lại
 * và không phụ thuộc cấu hình module của TypeScript.
 */
export function readJsonData<T>(fileName: string): T {
  const filePath = resolve(process.cwd(), 'data', fileName);
  const raw = readFileSync(filePath, 'utf-8');
  return JSON.parse(raw) as T;
}
