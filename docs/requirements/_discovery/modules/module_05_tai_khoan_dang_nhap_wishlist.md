# Module 05 — Đăng nhập/Đăng ký (AUTH) · Tài khoản (ACCOUNT) · Wishlist (WISH)

← Quay lại [`system_map.md`](../system_map.md) · Trạng thái recon tra ở [`README.md`](../../README.md)

> Ba module chung file vì **luôn được khảo sát cùng nhau** và dùng chung phiên đăng nhập. Ranh giới truy vết vẫn là **3 prefix riêng** → sẽ sinh **3 file** `requirements_auth.md` · `requirements_account.md` · `requirements_wish.md`.

---

## 5.1 — Đăng nhập · Đăng ký · Quên mật khẩu

| | |
|---|---|
| Prefix | `AUTH` |
| Bí danh trong tài liệu | "Sign In" · "Sign Up" |
| Route | `/customer/account/login/` · `/customer/account/create/` · `/customer/account/forgotpassword/` |
| Loại màn hình | Form |
| Risk | 🔴 Cao — cổng vào mọi chức năng customer |
| Ước REQ | 20–28 |

### Đã kiểm chứng (2026-09-11)

| Hạng mục | Quan sát được |
|---|---|
| Đăng nhập | ✅ **Thành công** với tài khoản test. Sau đăng nhập chuyển về trang referer (`/wishlist/`) |
| Form login | `#login-form`, POST `/customer/account/loginPost/`, field `form_key` · `login[username]` (type email) · `login[password]` |
| Thông báo lỗi | Nguyên văn: **"Invalid login or password."** |
| Form đăng ký | POST `/customer/account/createpost/`, field: `firstname`(required) · `lastname`(required) · `is_subscribed`(checkbox) · `email` · `password` · `password_confirmation` |
| Forgot password | Link tới `/customer/account/forgotpassword/` từ cả 2 form |
| Amazon Pay | Trang login có `amazon-sign-in-button-container` → có tuỳ chọn đăng nhập bằng Amazon |

### ⚠️ Phát hiện quan trọng — popup che form

Trang `/customer/account/login/` (và trang chủ) hiển thị **popup Klaviyo "Spin to Win"** (vòng quay giảm giá 5%/10%/15%/20% Off) che toàn màn hình. Hệ quả đã quan sát trực tiếp:

- Thao tác gõ vào form đăng nhập **rơi vào field email của popup**, không vào form login
- Kết quả là đăng nhập thất bại **một cách âm thầm** — không có lỗi nào chỉ ra nguyên nhân thật
- Sau khi đóng popup, cùng tài khoản đó đăng nhập thành công ngay

→ Mọi script automation đụng tới trang có popup **bắt buộc đóng popup trước**. Ghi nhận ở `AMB-02`.

### ⚠️ Lệch pha với tài liệu

| Tài liệu | UI thực tế | Mã |
|---|---|---|
| Sign Up **phải luôn có captcha**; Forgot Password cũng vậy | DOM form create không có element captcha nào | `AMB-03` |
| Form Sign Up có checkbox **"Show Password"** | Không thấy trong DOM | `AMB-03` |

### Vùng chưa xác minh — riêng AUTH

- Rule độ mạnh mật khẩu (tài liệu: ≥ 8 ký tự, có hoa/thường/ký tự đặc biệt) — chưa trigger validation
- Thông báo khi **email đã tồn tại** lúc đăng ký
- Email **"Welcome to Miz Mooz"** sau khi đăng ký
- Chống spam Forgot Password (submit nhiều lần)
- **Session timeout 15 ngày** · đăng nhập đồng thời nhiều thiết bị

---

## 5.2 — Tài khoản khách hàng

| | |
|---|---|
| Prefix | `ACCOUNT` |
| Bí danh trong tài liệu | "Customer Account" |
| Route gốc | `/customer/account/` |
| Loại màn hình | Dashboard + 11 màn hình con |
| Risk | 🔴 Cao — chứa địa chỉ, thẻ đã lưu, số dư tiền |
| Ước REQ | 35–45 |

### Sidebar — 11 mục, đã kiểm chứng đầy đủ

| Mục | Route | Ghi chú |
|---|---|---|
| My Orders | `/sales/order/history/` | Bảng: `ORDER # · DATE · SHIP TO · ORDER TOTAL · STATUS · ACTION` |
| My Wish List | `/wishlist/` | → xem 5.3 |
| Address Book | `/customer/address/` | Có Default Billing + Default Shipping riêng |
| Account Information | `/customer/account/edit/` | Đổi email, đổi mật khẩu |
| Store Credit | `/storecredit/info/` | Tài liệu: Balance · Redeem Gift Card · Balance History |
| Stored Payment Methods | `/vault/cards/listaction/` | Braintree vault — chỉ Credit Card |
| Gift Cards | `/giftcard/customer/` | → xem [`module_07`](module_07_gift_card.md) |
| Newsletter Subscriptions | `/newsletter/manage/` | → xem [`module_11`](module_11_newsletter_va_email.md) |
| Restock Notifications | `/outofstocknotification/products/` | **Tài liệu để trống phần Expected** — vùng cần recon kỹ |
| My Rewards | `/rewards-program/dashboard/` | → xem [`module_06`](module_06_diem_thuong.md) |
| My Returns | `/rmac/returns/history/` | → xem [`module_08`](module_08_tra_hang_rma.md) |

### Trạng thái đơn hàng quan sát được

`Complete` · `Order Submitted`

Tài liệu còn nhắc 2 trạng thái tuỳ biến chưa gặp: `Processing Amazon Issue` · `Processing Afterpay Issue`.

> 🔒 Dữ liệu đơn hàng thật trên staging **không chép vào tài liệu** — chỉ ghi tên trạng thái và cấu trúc bảng.

### Vùng chưa xác minh — riêng ACCOUNT

- Thêm/sửa/xoá địa chỉ · giới hạn số địa chỉ · Google address suggestion · "Pick My location"
- **Re-order** từ lịch sử đơn (và quy tắc sp out of stock không re-order được)
- Số dư và Balance History của Store Credit
- Lưu/xoá thẻ trong Stored Payment Methods

---

## 5.3 — Wishlist

| | |
|---|---|
| Prefix | `WISH` |
| Route | `/wishlist/` · `/wishlist/index/index/` |
| Loại màn hình | Danh sách |
| Risk | 🟡 Trung bình |
| Ước REQ | 8–12 |

### Đã kiểm chứng (2026-09-11)

| Hạng mục | Quan sát được |
|---|---|
| Guest truy cập `/wishlist/` | ✅ Bị chuyển sang `/customer/account/login/referer/<base64>/` — khớp tài liệu |
| Customer truy cập | ✅ Vào được, tiêu đề `My Wish List` |
| Bộ đếm ở header | `Wish List (0)` |
| Hành động quan sát được | `Add to Cart` · `Go to Wish List` |

### Vùng chưa xác minh — riêng WISH

- Add wishlist từ **PLP** và **PDP** (tài liệu: guest bấm phải hiện popup login)
- **Thêm comment** vào item trong wishlist (tài liệu nêu "Wishlist with ability to add comments")
- Add to cart **từ** wishlist

## Evidence

❌ Chưa có ảnh — xem lý do ở mục 7 của [`system_map.md`](../system_map.md).
