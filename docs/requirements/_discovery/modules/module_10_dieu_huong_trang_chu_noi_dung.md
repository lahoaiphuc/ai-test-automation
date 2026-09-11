# Module 10 — Điều hướng (NAV) · Trang chủ (HOME) · Nội dung tĩnh & Liên hệ (CMS)

← Quay lại [`system_map.md`](../system_map.md) · Trạng thái recon tra ở [`README.md`](../../README.md)

> Ba module chung file vì đều là **lớp trình bày dùng chung**, khảo sát cùng lượt. Ranh giới truy vết vẫn là **3 prefix riêng** → sẽ sinh **3 file** requirements riêng.

---

## 10.1 — Điều hướng

| | |
|---|---|
| Prefix | `NAV` |
| Bí danh | "Header" · "Footer" · "Menu" · "Breadcrumb" |
| Loại màn hình | Khung chung mọi trang |
| Risk | 🟡 Trung bình |
| Ước REQ | 12–18 |

Cây menu và footer đầy đủ: xem mục 2 của [`system_map.md`](../system_map.md).

### Đã kiểm chứng

| Hạng mục | Quan sát được |
|---|---|
| Menu chính | Shop · Best Sellers · Verbenas · Sale · About · Gift Cards |
| Menu Shop | 3 nhóm con: **BY TREND** (7 mục) · **BY STYLE** (8 mục) · **BY SEASON** (2 mục) |
| Thanh khuyến mãi | 2 thông điệp: `Take 30% Off Select Verbenas Styles with Code VERBENAS` → `/shop?k_welcome_code=SUNLIT20` · `*FREE SHIPPING ON ORDERS OVER $150` → `/shipping-handling/` |
| Icon header | Search · Account · Wishlist (có bộ đếm) · Cart (có bộ đếm) · Currency |
| Breadcrumb | ✅ Đủ cấp: `Home > Shop > Boots > Juke` |
| Footer | Help Center (Gorgias, ngoài site) · FAQ · Shipping · Returns · Size chart · Reward program · Contact · My account (4 link) · Privacy · Terms · 2 form Klaviyo |

### ⚠️ Lệch pha với tài liệu

| Tài liệu | UI thực tế | Mã |
|---|---|---|
| Menu có mục **Blog** | Không có Blog trong menu; `/blog` → **404 Not Found** | `AMB-05` |
| **SALE** hiển thị 22 sp/page (UI đặc biệt) | `/clearance` chưa đối chiếu số lượng; Best Sellers đã xác nhận là 18 | `AMB-05` |

### Vùng chưa xác minh — riêng NAV

- Menu con có bung khi **hover** không (mới đọc DOM, chưa thao tác hover)
- Thanh khuyến mãi có config được từ admin không
- Nút **Size chart** ở footer dùng `href="#"` → popup; chưa mở thử

---

## 10.2 — Trang chủ

| | |
|---|---|
| Prefix | `HOME` |
| Bí danh | "Home page" |
| Route | `/` |
| Risk | 🟢 Thấp |
| Ước REQ | 8–12 |

### Đã kiểm chứng

| Hạng mục | Quan sát được |
|---|---|
| Section | Hero banner · **NOW TRENDING** (13 sp, có tên + giá) · SHIPPING & RETURNS (4 ô: Free Shipping · Price Matching · Returns · Rewards Program) · Instagram feed (`Find us on social! @mizmooz #mymizmooz`) |
| Popup | **Klaviyo "Spin to Win"** — vòng quay 5% / 10% / 15% / 20% Off, có field Email và nút `Spin & Save` |
| Accessibility | Widget **UserWay** (icon góc dưới trái) |

### ⚠️ Vấn đề phát hiện trên staging

- Trang chủ hiển thị **nhiều chỗ** dòng chữ `File is not exist on server.` thay cho hình ảnh → media lỗi. Ghi nhận ở `AMB-06`
- Popup Spin-to-Win **che toàn màn hình và chặn tương tác** — chi tiết ở [`module_05`](module_05_tai_khoan_dang_nhap_wishlist.md) mục 5.1. Tài liệu **không hề nhắc** tới popup này

### Vùng chưa xác minh — riêng HOME

- Hero banner có **auto slide** không
- Instagram feed có đúng quy tắc "chỉ lấy bài ảnh, bỏ bài video" không
- Link mạng xã hội (Instagram · Facebook · Pinterest · X)
- Responsive

---

## 10.3 — Nội dung tĩnh & Liên hệ

| | |
|---|---|
| Prefix | `CMS` |
| Bí danh | "Footer > CMS Page" · "Link Contact" |
| Risk | 🟢 Thấp |
| Ước REQ | 10–15 |

### Trang CMS đã kiểm chứng tồn tại

| Trang | Route | Trạng thái |
|---|---|---|
| FAQ | `/faq/` | ✅ 200 — h1 `Frequently Asked Questions` |
| Shipping & Handling | `/shipping-handling/` | ✅ 200 |
| About (Brand Story) | `/mizmooz-brand-story/` | ✅ 200 |
| Privacy Policy | `/miz-mooz-privacy-and-policy/` | Có link ở footer |
| Terms and Conditions | `/mizmooz-terms-conditions/` | Có link ở footer |
| Size chart | popup (`href="#"`) | Chưa mở thử |
| Help Center | `miz-mooz-s0l3kmffuq6.gorgias.help` | **Ngoài site** — Gorgias |

### Form Contact — `/contact/`

Field đã đọc từ DOM: `i_am_a` (select) · `writing_from` (select) · `name` · `lname` · `email` · `telephone` · `order` · `comment` (textarea) · `hideit` (hidden — **honeypot chống spam**)

→ Form phong phú hơn tài liệu mô tả. Hai select `i_am_a` / `writing_from` là **field phân loại tài liệu không nhắc tới** — cần lấy đủ option ở tầng recon module.

### Vùng chưa xác minh — riêng CMS

- Giá trị option của `i_am_a` và `writing_from`
- Contact có cho **đính kèm file** không (tài liệu nêu "kể cả hình ảnh và file") — chưa thấy field upload trong DOM
- Email gửi admin + email confirm cho user
- Nội dung popup Size chart

## Evidence

❌ Chưa có ảnh — xem lý do ở mục 7 của [`system_map.md`](../system_map.md).
