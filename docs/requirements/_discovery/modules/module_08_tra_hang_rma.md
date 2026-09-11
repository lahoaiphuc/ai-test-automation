# Module 08 — Trả hàng (RMA)

← Quay lại [`system_map.md`](../system_map.md) · Trạng thái recon tra ở [`README.md`](../../README.md)

| | |
|---|---|
| Prefix | `RMA` |
| Bí danh trong tài liệu | "Send a RMA request" · "Return" |
| Route | `/rmac/guest/request` (guest) · `/rmac/returns/history/` (customer) · `/sales/guest/form/` (Orders and Returns) |
| Loại màn hình | Form + Wizard + Lịch sử |
| Nền tảng | **Amasty RMA** (tiền tố route `rmac`) |
| Risk | 🔴 Cao — dính hoàn hàng, ràng buộc trạng thái đơn |
| Ước REQ | 15–20 |

## Đã kiểm chứng (2026-09-11)

### `/rmac/guest/request` — tiêu đề trang `RMA Login`

Form **Start a return or exchange**: `oar_order_id` (Order Number) · `oar_email` (Email) → nút `Continue`

Nội dung chính sách hiển thị nguyên văn trên trang:
- Chấp nhận trả hàng **trong 30 ngày** kể từ ngày giao, hàng chưa sử dụng, còn nguyên bao bì
- **Không** nhận hàng đã dùng hoặc đã chỉnh sửa
- Hàng gắn nhãn **Final Sale** không được trả
- Hàng hỏng khi nhận: báo qua email hỗ trợ

### `/sales/guest/form/` — tiêu đề `Orders and Returns`

Form: `oar_order_id` · **`oar_type`** (select) · `oar_email` · `oar_zip`

→ Có **2 lối vào khác nhau**: một dành riêng cho RMA (Amasty), một là form Orders & Returns chuẩn của Magento. Tài liệu gộp chung thành một ý; thực tế là hai màn hình.

## Vùng chưa xác minh — riêng module này

- **Ràng buộc "chỉ order Complete mới request RMA được"** — cần đơn hàng ở đúng trạng thái để thử
- Các bước sau khi `Continue`: chọn item · chọn lý do trả · gửi yêu cầu
- Màn hình `/rmac/returns/history/` của customer
- Giá trị của select `oar_type` (nhiều khả năng Email / ZIP)
- **Rule RMA** mà tài liệu nhắc tới nhưng không mô tả
- Email trả hàng (tài liệu: phải có Order ID, link `TRACK YOUR RETURN`, ảnh, tên sp, size, lý do)

## Evidence

❌ Chưa có ảnh — xem lý do ở mục 7 của [`system_map.md`](../system_map.md).
