# Module 01 — Chi tiết sản phẩm (PDP)

← Quay lại [`system_map.md`](../system_map.md) · Trạng thái recon tra ở [`README.md`](../../README.md)

| | |
|---|---|
| Prefix | `PDP` |
| Bí danh trong tài liệu | "Product" |
| Route mẫu | `/kayla.html` · `/juke1.html` · `/gift-card.html` (URL suffix `.html`, không có thư mục cha) |
| Loại màn hình | Chi tiết sản phẩm |
| CRUD | Chỉ đọc (mặt khách) + hành động: Add to Cart · Add to Wish List · Notify me · Write a Review |
| Số tab/section | 5 — Description (STORY) · Details (DETAILS) · Reviews (Yotpo) · Shipping & Returns · Size chart (popup) |
| Ước lượng độ lớn | ~15–20 field/thuộc tính hiển thị + 2 nhóm variant + 4 biến thể nút mua |
| Risk | 🔴 **Cao** |
| Ước REQ | 40–55 |

## Vì sao risk cao

Đây là màn hình có **nhiều nhánh logic nhất** của cả storefront:
- Nút mua đổi theo tồn kho: `ADD TO CART` / `NOTIFY ME` / `PRE-ORDER` / `X` (nếu thuộc category SALE)
- Giá đổi theo tổ hợp color × size, và có 4 kịch bản hiển thị special price khác nhau (tài liệu mô tả rõ)
- Ảnh đổi theo color đã chọn, có ràng buộc ảnh BASE
- Ngưỡng cảnh báo tồn kho `Only ... left in stock` khi qty ≤ 2

## Đã kiểm chứng trên UI (2026-09-11)

| Hạng mục | Quan sát được |
|---|---|
| Loại sản phẩm | Configurable — kiểm chứng trên `kayla.html` |
| Attribute variant | `color` (attribute-id 92, 6 option: Ochre · Blue · Orchid · Latte · Black · Brandy Leopard) · `size_configurable` (7 option: 36→42) |
| Mặc định khi vào trang | Color **đã được chọn sẵn** (`option-selected="283"` → "Brandy Leopard"); size **chưa chọn** — khớp tài liệu |
| Breadcrumb | `Home > Shop > Boots > Juke` — đủ cấp |
| Nút quan sát được | `ADD TO CART` · `Add to Wish List` · `Notify me` / `GET NOTIFIED` · `Write a Review` |
| Review | Yotpo — hiển thị `0 Reviews` + `Write a review` |
| Thông tin phụ | `Size chart` (popup) · `Shipping & Returns` · `Free shipping on orders over $150` · `Earn points with every purchase` |
| Related product | Có box sản phẩm liên quan (quan sát 4 nút `Add to Cart` phụ) |
| Add to cart | ✅ Chạy được — chọn size 38 → qty giỏ tăng |

## Phát hiện tầng network (riêng module này)

| Quan sát | Ý nghĩa |
|---|---|
| `GET /customer/section/load/?sections=cart,directory-data,magepal-gtm-jsdatalayer,messages` | Cơ chế cập nhật giỏ hàng là **customer section** của Magento — giỏ hàng cập nhật bất đồng bộ, **không** phản ánh ngay sau khi bấm. Test tự động phải chờ section load xong, không chờ theo thời gian |
| `magepal-gtm-jsdatalayer` chứa `{"ecommerce":{"currencyCode":"USD"},"pageType":"catalog_product_view","list":"detail"}` | Có dataLayer GTM — có thể dùng để assert sự kiện tracking |
| Template minicart nạp sẵn: `Afterpay_Afterpay/.../button-minicart.html`, `PayPal_Braintree/.../mini-cart.html` | Afterpay và Braintree được nạp ngay ở tầng PDP |

## Vùng chưa xác minh — riêng module này

| Vùng | Lý do |
|---|---|
| Attribute **`width`** (Medium/Wide/Narrow) | Tài liệu có nêu, nhưng 2 PDP đã mở chỉ có `color` + `size_configurable`. Cần SKU có cấu hình width |
| Trạng thái **out of stock / pre-order** | Chưa gặp SKU nào ở trạng thái này. 7/7 size của `kayla` đều còn hàng (không option nào `disabled`) |
| 4 kịch bản hiển thị **special price** | Chưa gặp sản phẩm có special price |
| Hành vi **`NOTIFY ME`** và ràng buộc "không cho notify sản phẩm thuộc category SALE" | Cần SKU hết hàng để trigger |
| **Zoom ảnh**, hover đổi ảnh | Chưa thao tác |

## Lưu ý khi automation

⚠️ **Swatch render bất đồng bộ.** `.swatch-attribute` chưa tồn tại ngay khi trang load xong — phải chờ nó xuất hiện rồi mới đọc option. Truy vấn sớm trả về mảng rỗng, dễ bị hiểu nhầm là "sản phẩm không có variant".

⚠️ **Theme phụ thuộc chiều rộng viewport.** Viewport width = 0 làm theme ném lỗi `Can not detect viewport width` và **không render swatch**. Bắt buộc đặt viewport desktop trước khi mở PDP.

## Evidence

❌ Chưa có ảnh — xem lý do ở mục 7 của [`system_map.md`](../system_map.md).
