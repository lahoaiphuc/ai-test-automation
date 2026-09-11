# Module 09 — Multi-store & Đa tiền tệ (STORE)

← Quay lại [`system_map.md`](../system_map.md) · Trạng thái recon tra ở [`README.md`](../../README.md)

| | |
|---|---|
| Prefix | `STORE` |
| Bí danh trong tài liệu | "Multi Store" · "Currency icon (MIZ-MOOZ)" · "Price displayed in multi currencies" |
| Route | `/stores/store/redirect/___store/<code>/___from_store/<code>/uenc/<base64>/` |
| Loại màn hình | Cơ chế cắt ngang (switcher ở header) |
| Risk | 🔴 Cao — sai tiền tệ là sai tiền |
| Ước REQ | 8–12 |

## Đã kiểm chứng (2026-09-11)

### 6 store view

| Nhãn trên UI | Store code | Ghi chú |
|---|---|---|
| USD | `mm_usd` | **Mặc định** |
| CAN | `mm_ca` | |
| EUR | `mm_eu` | |
| POUND | `mm_uk` | |
| AUD | `mm_aud` | |
| NZD | `mm_nzd` | |

### Chuyển store

✅ Kiểm chứng thành công: chuyển từ `mm_usd` sang `mm_ca` → cookie `store=mm_ca`, nhãn switcher đổi thành `CAN`, và chuyển ngược lại được.

Cơ chế: URL redirect mang `___store` (đích) + `___from_store` (nguồn) + `uenc` (URL đích mã hoá base64).

### Ràng buộc phát hiện thêm — tài liệu không nhắc

Trang `/rewards` ghi: **`*Points can only be earned when shopping in USD`**

→ Điểm thưởng **chỉ tích luỹ ở store `mm_usd`**. Đây là ràng buộc cắt ngang `STORE` × `REWARD`, cần thành REQ riêng ở cả hai module.

## Vùng chưa xác minh — riêng module này

- **Auto-select store theo IP** — tài liệu mô tả hệ thống tự chọn store theo quốc gia của IP, và rơi về US cho mọi quốc gia ngoài danh sách. Chỉ kiểm chứng được thao tác switch **thủ công**; cần truy cập từ IP nước khác hoặc xác nhận cấu hình với dev
- Giá sản phẩm có đổi đúng theo currency ở **PLP/PDP** không (mới xác nhận nhãn switcher đổi, chưa đối chiếu con số giá)
- **Currency ở bước thanh toán** — chặn bởi `AMB-01`
- Ràng buộc "đổi currency thì **chỉ giá** đổi, ngôn ngữ vẫn English"
- Giỏ hàng có được giữ nguyên khi đổi store không

## Evidence

❌ Chưa có ảnh — xem lý do ở mục 7 của [`system_map.md`](../system_map.md).
