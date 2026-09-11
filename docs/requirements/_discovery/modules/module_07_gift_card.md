# Module 07 — Gift Card (GIFT)

← Quay lại [`system_map.md`](../system_map.md) · Trạng thái recon tra ở [`README.md`](../../README.md)

| | |
|---|---|
| Prefix | `GIFT` |
| Bí danh trong tài liệu | "Gift Card" · "Product Gift Card" · "Redeem Gift Card to Store Credit" |
| Route | `/gift-card.html` (mua) · `/giftcard/customer/` (quản lý, cần đăng nhập) |
| Loại màn hình | Trang sản phẩm đặc biệt + màn hình quản lý |
| Risk | 🔴 Cao — gift card là công cụ thanh toán |
| Ước REQ | 12–18 |

## Đã kiểm chứng (2026-09-11)

Trang `/gift-card.html` (tiêu đề `Gift Card`) có cấu trúc:

| Nhóm | Field / giá trị |
|---|---|
| **Amount** | Dropdown: `Choose an Amount...` · $25 · $50 · $100 · $150 · $200 · $250 · $300 · $350 · $400 · $500 · $600 · **`Other Amount...`** |
| Amount tuỳ chọn | `Amount in USD`, ràng buộc hiển thị **`Minimum: $25.00`** |
| **Gift Card Information** | Sender Name · Sender Email · Recipient Name · Recipient Email · Message |
| Hành động | `ADD TO CART` · `Add to Wish List` |

→ Khớp tài liệu: "Mua Amount có sẵn / Nhập Amount để mua".

Loại sản phẩm: gift card **không có weight** (tài liệu nêu) → không phát sinh tracking vận chuyển.

## Vùng chưa xác minh — riêng module này

- Validation từng field (email người nhận, độ dài Message, chặn amount < $25)
- Màn hình `/giftcard/customer/` — danh sách gift card của khách
- **Redeem gift card sang Store Credit** (tài liệu: Account Dashboard > Manage Gift Card > Redeem)
- **Áp gift card ở checkout** — chặn bởi `AMB-01`
- Email gửi tới người nhận gift card
- Hiển thị amount ở 5 store view không phải USD

## Evidence

❌ Chưa có ảnh — xem lý do ở mục 7 của [`system_map.md`](../system_map.md).
