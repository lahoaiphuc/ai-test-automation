# CRM E2E Automation Framework

Playwright + TypeScript E2E Web UI framework theo Page Object Model, chạy trên
[Anh Tester CRM](https://crm.anhtester.com/admin/authentication).

## Cấu trúc thư mục

```
configs/                Tầng cấu hình – không chứa logic test
  env.config.ts         Load + validate biến môi trường theo TEST_ENV

src/
  pages/                Page Object Model
    BasePage.ts         Lớp cha: wrapper an toàn quanh Playwright Locator API
    LoginPage.ts        POM màn hình đăng nhập
    DashboardPage.ts    POM màn hình sau đăng nhập
  fixtures/
    fixtures.ts         Custom fixtures: tự inject Page Object + tài khoản đã login
  utils/
    json-reader.ts      Đọc dữ liệu test tĩnh (.json)
    logger.ts           Logger tối giản theo DEBUG_LOG

data/
  login.data.json       Bộ dữ liệu data-driven cho test đăng nhập

tests/
  login.spec.ts         Spec – chỉ mô tả kịch bản, thao tác qua POM

playwright.config.ts    Cấu hình trung tâm (đa trình duyệt, timeout, retry, reporter)
.env / .env.example     Cấu hình theo môi trường (dotenv)
```

## Cài đặt

```bash
npm install
npm run install:browsers
cp .env.example .env
```

> File `.env` đã được tạo sẵn với tài khoản demo nên có thể chạy ngay.

## Chạy test

```bash
npm test                 # Headless, cả 3 trình duyệt (chromium/firefox/webkit) - dùng thường ngày
npm run test:chromium    # Chỉ Chromium
npm run test:ui          # Playwright UI mode (watch + time-travel) - tốt nhất để debug
npm run test:headed      # Xem trình duyệt chạy: chỉ Chromium, workers=1
npm run test:debug       # Playwright Inspector, chạy từng bước
npm run test:smoke       # Chỉ test gắn tag @smoke
npm run report           # Mở HTML report của lần chạy gần nhất
```

> **Không chạy `npm test` ở chế độ headed.** WebKit headed trên Linux rất chậm và
> flaky (MiniBrowser không có compositor). Muốn xem trình duyệt chạy thì dùng
> `npm run test:headed` (Chromium) hoặc `npm run test:ui`. Ép headed thủ công:
> `HEADED=true npx playwright test --project=chromium`.

Chạy theo môi trường:

```bash
npm run test:staging     # cross-env TEST_ENV=staging
```

Chạy song song số worker cố định:

```bash
npx playwright test --workers=4
```

## Cấu hình đa môi trường

`configs/env.config.ts` chọn file theo thứ tự: biến môi trường sẵn có (CI) →
`.env.<TEST_ENV>` → `.env`. Tạo `.env.staging`, `.env.prod`… theo mẫu `.env.example`.

## Kịch bản đang được cover (`tests/login.spec.ts`)

| ID | Kịch bản |
|----|----------|
| TC_LOGIN_001 | Đăng nhập thành công, redirect về dashboard |
| TC_LOGIN_003/004 | Sai password / email chưa đăng ký → message lỗi |
| TC_LOGIN_005–009 | Bỏ trống field / email sai định dạng → ở lại trang login |
| TC_LOGIN_023/024 | Chống SQL Injection / XSS |
| TC_LOGIN_025 | Password bị che (type=password) |
| TC_LOGIN_041 | Truy cập `/admin` khi chưa login → redirect login |
| TC_LOGIN_042 | Logout rồi Back → không vào lại khu vực nội bộ |

## Reporter

- `list` – log ra console
- `html` – `reports/html` (mở bằng `npm run report`)
- `junit` – `reports/junit/results.xml` (cho CI)

Trace / screenshot / video chỉ được giữ lại khi test fail (`test-results/`).
