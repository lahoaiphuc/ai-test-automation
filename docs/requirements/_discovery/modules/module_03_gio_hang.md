# Module 03 — Giỏ hàng & Mini cart (CART)

← Quay lại [`system_map.md`](../system_map.md) · Trạng thái recon tra ở [`README.md`](../../README.md)

| | |
|---|---|
| Prefix | `CART` |
| Bí danh trong tài liệu | "Cart Page (chức năng quan trọng)" · "Mini Cart (Side cart)" |
| Route trang giỏ hàng | **`/checkout/cart/`** — ✅ hoạt động bình thường |
| Route sửa item | `/checkout/cart/configure/id/<item_id>/product_id/<product_id>/` |
| Side Cart | **Overlay trượt từ phải**, không có route riêng — mở bằng cách bấm **icon giỏ** ở header |
| Risk | 🔴 Cao |
| Ước REQ | 30–40 |

> ⚠️ **Đính chính lần 2 (2026-09-11).** Hai lần trước tôi ghi trang giỏ hàng "bị Fastly chặn 403". **SAI.** Trang hoạt động bình thường — QA đã cung cấp ảnh chụp trang mở đầy đủ. 403 chỉ xảy ra **với vị trí mạng của máy chạy agent** (node CDN châu Á: HKG · SIN · NRT). Đây là **giới hạn môi trường khảo sát**, tuyệt đối **không phải đặc tính của hệ thống** và **không** được sinh test case theo hướng đó.

---

## Trang giỏ hàng `/checkout/cart/`

> 📌 **Nguồn:** ảnh chụp màn hình do QA cung cấp ngày 2026-09-11 (agent không tự truy cập được — xem đính chính ở trên). Cần recon trực tiếp ở tầng module để lấy nguyên văn message và toàn bộ field.

### Cấu trúc quan sát được từ ảnh

**Breadcrumb:** `Shopping Cart`

**Bảng sản phẩm — 4 cột:** `Product` · `Price` · `Quantity` · `Subtotal`

| Thành phần | Nội dung |
|---|---|
| Ảnh sản phẩm | Hiển thị đúng ảnh của color đã chọn |
| Tên | `Kayla` |
| Variant | `Brandy Leopard - 39` (Color - Size trên một dòng) |
| Hành động trên item | **icon bút chì** (sửa) · **icon thùng rác** (xoá) — dạng icon, không phải chữ |
| Price | `$129.95` |
| Quantity | Ô số kèm nút **`−`** / **`+`** |
| Subtotal | `$129.95` |

**Nút dưới bảng:** `Continue Shopping` (trái) · `Update Shopping Cart` (phải)

**Khối trái — 2 tab:**

| Tab | Nội dung |
|---|---|
| **Estimate Shipping and Tax** (đang mở) | `Enter your destination to get a shipping estimate.` · **Country** (select, mặc định `United States`) · **State/Province** (select) · **Zip/Postal Code** (input, ví dụ `07104`) |
| **Promo Codes** | Chưa mở trong ảnh |

Khi chưa đủ thông tin địa chỉ, khối này hiện: **`Sorry, no quotes are available for this order at this time. Please check your shipping address and try again.`** (nguyên văn — cùng message với trang checkout)

**Khối phải — Summary:**

```
Subtotal      $129.95
Tax           $0.00
─────────────────────
Order Total   $129.95
```

- Banner PayPal: `Pay in 4 interest-free payments of $32.49. Learn more` (= Order Total ÷ 4)
- Nút **`CHECKOUT`** (cam, nổi bật)
- Nút **`PayPal`** · **`Pay Later`**

⚠️ **Lệch pha:** tài liệu nêu express checkout ở Cart gồm **Amazon, PayPal, Google Pay, Apple Pay**. Trang giỏ hàng thực tế chỉ có **PayPal · Pay Later**.

---

## Side Cart — đã khảo sát trực tiếp (2026-09-11)

Mở bằng cách **bấm icon giỏ hàng ở góc phải header** (`.minicart-wrapper .action.showcart`).

```
CART
  [ảnh]  Kayla
         Color  Brandy Leopard
         Size   38
         $129.95
         [−] 2 [+]        ← chỉnh qty ngay tại side cart
         Edit   Remove
  SUBTOTAL   $259.90
  ──────────────
  [ Go to Cart ]          ← <a href="/checkout/cart/">
  [ Checkout  ]           ← <button> KHÔNG có href → /onestepcheckout/
  [ PayPal ] [ Pay Later ]
  [ G Pay ]
```

| Hành động | Phần tử | Ghi chú |
|---|---|---|
| Mở side cart | `a.action.showcart` | Text `My Cart 2 2items` |
| Cập nhật số lượng | `button.update-cart-item`, id `update-cart-item-<item_id>` | |
| Sửa item | `a.action.edit` → `/checkout/cart/configure/id/…/product_id/…/` | Quay lại PDP ở chế độ cập nhật |
| Xoá item | `a.action.delete` (text `Remove`), `href="#"` | |
| Sang trang giỏ | `a` text `Go to Cart` → `/checkout/cart/` | |
| **Sang checkout** | **`button` text `Checkout`** — không có `href` | → **`/onestepcheckout/`** |
| Express | PayPal · Pay Later · G Pay | `paypal-express-in…` · `braintree-applepay-minicart` · `braintree-googlepay-button` |

✅ Side cart hiển thị đúng variant (Color + Size), ảnh theo color, subtotal đúng, cho cập nhật qty trực tiếp.

⚠️ **Khác biệt giữa Side Cart và trang Cart:** side cart có thêm **G Pay**, trang Cart thì không. Cả hai đều **không có Amazon Pay** (nhưng trang `/onestepcheckout/` thì **có**).

---

## Add to cart — đã kiểm chứng

| Hạng mục | Kết quả |
|---|---|
| Add to cart ở vai **Guest** | ✅ |
| Add to cart ở vai **Customer** | ✅ |
| Merge giỏ guest → customer khi đăng nhập | ✅ |
| Bộ đếm header cập nhật | ✅ — **bất đồng bộ** qua `GET /customer/section/load/?sections=cart,...`, trễ vài giây |
| Giỏ về 0 sau khi đặt hàng | ✅ |
| Giỏ về 0 sau khi đăng xuất | ✅ (giỏ customer không theo sang phiên guest) |

---

## Vùng chưa xác minh — riêng module này

| Vùng | Ghi chú |
|---|---|
| Tab **Promo Codes** ở trang giỏ | Chưa mở — cần recon trực tiếp |
| **Estimate Shipping and Tax** hoạt động thật | Mới thấy giao diện và message lỗi khi thiếu địa chỉ |
| Nút **Update Shopping Cart** | Chưa bấm |
| Nút **Proceed to checkout bị disable khi có sp out of stock** | Chưa gặp tình huống |
| Thông báo **pre-order** trong giỏ | Chưa gặp sp pre-order |
| Giá theo **currency của store đang chọn** | Chưa thử ở store khác USD |
| Thông báo **`You have no items in your shopping cart.`** khi giỏ rỗng | Chưa xác minh nguyên văn |
| Giới hạn **số item tối đa** hiển thị trong side cart | Chưa xác minh |
| Giữ giỏ **sau khi đóng trình duyệt** | Chưa thử |

### `AMB-07` — side cart không tự bung

Tài liệu yêu cầu mini cart **tự bung vài giây rồi đóng** sau khi add to cart. Thực tế quan sát: side cart **không tự bung**, phải bấm icon giỏ. Cần xác nhận là thay đổi có chủ đích hay lỗi.

## Evidence

📷 Trang giỏ hàng: ảnh do QA cung cấp trong hội thoại ngày 2026-09-11 (chưa lưu vào repo).
❌ Side cart: chưa lưu được ảnh xuống đĩa — xem lý do ở mục 7 của [`system_map.md`](../system_map.md).
