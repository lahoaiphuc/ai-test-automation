# Module 11 — Newsletter (NEWS) · Email giao dịch (EMAIL)

← Quay lại [`system_map.md`](../system_map.md) · Trạng thái recon tra ở [`README.md`](../../README.md)

> Hai module chung file vì cùng thuộc mảng **thông điệp gửi tới khách**. Ranh giới truy vết vẫn là **2 prefix riêng** → sẽ sinh **2 file** requirements riêng.

---

## 11.1 — Newsletter

| | |
|---|---|
| Prefix | `NEWS` |
| Bí danh | "Newsletter register" · "Newsletters" |
| Nền tảng | **Klaviyo** (`static.klaviyo.com`, `static-forms.klaviyo.com`, `a.klaviyo.com`) |
| Route | Form nhúng ở header/footer/trang login · quản lý tại `/newsletter/manage/` · checkbox `is_subscribed` ở form đăng ký |
| Loại màn hình | Form nhúng |
| Risk | 🟡 Trung bình |
| Ước REQ | 10–14 |

### Đã kiểm chứng (2026-09-11)

| Hạng mục | Quan sát được |
|---|---|
| 2 form Klaviyo | Form **Email** (field `email`) và form **SMS** (field `phone-number`, type tel) — khớp tài liệu |
| Tiêu đề form | `Keep in touch! Save 10% on your first order` · `Join our SMS list for flash sales and exclusive offers!` |
| Điểm xuất hiện | Footer mọi trang · trang `/customer/account/login/` |
| Đăng ký khi tạo account | Checkbox `is_subscribed` trong form `/customer/account/create/` |
| Quản lý sau đăng nhập | `/newsletter/manage/`. Dashboard hiển thị: `You are subscribed to "General Subscription".` |
| **Popup Spin-to-Win** | Cũng là form Klaviyo — vòng quay giảm giá, có field Email + nút `Spin & Save`. **Tài liệu không nhắc tới** |

### Vùng chưa xác minh — riêng NEWS

- Email xác nhận đăng ký + **coupon 10%** cho người đăng ký lần đầu
- Quy tắc "mỗi email chỉ nhận coupon 1 lần", đăng ký lại không nhận email nữa
- Đăng ký SMS (tài liệu: **chỉ số điện thoại US mới test được**)
- Đăng ký newsletter **tại bước checkout** — chặn bởi `AMB-01`
- Điều kiện hiển thị của popup Spin-to-Win (`AMB-02`)

---

## 11.2 — Email giao dịch

| | |
|---|---|
| Prefix | `EMAIL` |
| Bí danh | "Emails" · "Email service Transaction" |
| Loại | **Ngoài UI** — kiểm chứng bằng cách đọc hộp thư nhận |
| Risk | 🔴 Cao — là bằng chứng giao dịch gửi tới khách |
| Ước REQ | 15–20 |

### 12 loại email theo tài liệu

| # | Email | Kích hoạt bởi module | Yêu cầu nội dung (tài liệu) |
|---|---|---|---|
| 1 | Order Confirmation | `CHECKOUT` | Order ID, thời gian, sản phẩm, ảnh, size, color, qty, giá, ship, tax, discount, grand total, địa chỉ billing/shipping, email, payment method, shipping method |
| 2 | Order Shipped | `CHECKOUT` | như trên |
| 3 | Order Refund | `CHECKOUT` | như trên |
| 4 | Welcome Register | `AUTH` | Có link `START EARNING POINTS NOW` → phải dẫn tới My Account |
| 5 | Forgot Password | `AUTH` | Link reset phải dẫn tới màn hình đặt mật khẩu mới |
| 6 | Subscribe Newsletter | `NEWS` | (tài liệu để trống) |
| 7 | Subscription Confirmation (out of stock) | `PDP` | Xác nhận đã đăng ký chờ hàng |
| 8 | Product Back in Stock | `PDP` | URL sản phẩm phải đúng sản phẩm đã đăng ký |
| 9 | Return | `RMA` | Order ID, link `TRACK YOUR RETURN`, ảnh, tên sp, size, lý do trả |
| 10 | Abandoned Cart | `CART` | Gửi từ **Klaviyo**, theo rule `XX ngày sau {hành động}` |
| 11 | Contact — notify admin | `CMS` | Thông tin phải khớp đúng nội dung user gửi |
| 12 | Contact — confirm customer | `CMS` | |

### Vùng chưa xác minh — riêng EMAIL

**Toàn bộ.** Chưa kiểm chứng được email nào — cần quyền đọc hộp thư nhận của tài khoản test.

⚠️ 3 loại email đầu (Order Confirmation / Shipped / Refund) phụ thuộc `CHECKOUT`, nên cũng bị chặn gián tiếp bởi `AMB-01`.

## Evidence

❌ Chưa có ảnh — xem lý do ở mục 7 của [`system_map.md`](../system_map.md).
