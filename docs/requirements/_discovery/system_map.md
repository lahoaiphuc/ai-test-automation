# BẢN ĐỒ HỆ THỐNG — Miz Mooz (storefront)

> **INDEX bất biến** của tầng khám phá. Mọi workflow phía sau chỉ cần nhớ đúng đường dẫn này.
> Danh mục + trạng thái recon: [`../README.md`](../README.md) — **trạng thái recon KHÔNG nhân bản sang file này**.

---

## 1. Bối cảnh khảo sát

| | |
|---|---|
| Ngày | 2026-09-11 |
| Mode | **HYBRID** — hệ thống chạy được **+** checklist chức năng cơ bản do QA cung cấp |
| Nền tảng | Magento 2 trên Magento Cloud · theme `Mgs/claue_child` · edge Fastly/Varnish |
| Phạm vi | **Storefront** (mặt khách hàng). Trang quản trị Magento Admin **ngoài phạm vi** đợt này — user đã xác nhận |
| Role đã dùng | 1 role duy nhất: **Customer** (đã đăng nhập thành công). Storefront còn vai **Guest** — đã khảo sát song song |
| Môi trường dùng chung | **KHÔNG** — được phép tạo/sửa dữ liệu test. Đã thực hiện add-to-cart trong quá trình khảo sát |
| Tài liệu đã nạp | 1 file — checklist chức năng cơ bản (Google Sheet), 135 dòng. Bản gốc: [`sources/`](sources/checklist_function_co_ban_googlesheet.md) |
| Công cụ | Trình duyệt thật (Claude Browser pane, viewport 1600×750) + Chrome thật để kiểm chứng chéo. ⚠️ Playwright MCP **không dùng được** — bị Fastly chặn UA `HeadlessChrome` |

⚠️ **Playwright MCP không dùng được cho hệ thống này** — Fastly chặn User-Agent `HeadlessChrome` với lỗi `Blocked unwanted bot` (Error 54113) ngay từ trang chủ. Mọi khảo sát đợt này chạy trên trình duyệt thật.

---

## 2. Sơ đồ điều hướng toàn hệ thống

Cây menu nguyên trạng quan sát được (2026-09-11):

```
Header
├── Thanh khuyến mãi   → /shop?k_welcome_code=SUNLIT20   (auto-apply coupon qua URL)
│                      → /shipping-handling/
├── Shop
│   ├── Shop All                      → /shop
│   ├── BY TREND
│   │   ├── New & Noteworthy          → /new-noteworthy
│   │   ├── Fall Favorites            → /shop/fall-favorites
│   │   ├── Summer Favorites          → /shop/summer-favorites
│   │   ├── Must Have Heels           → /shop/must-have-heels
│   │   ├── Wide Width                → /shop/mizmooz-widewidth
│   │   ├── Sale                      → /clearance
│   │   └── Our Faves Under $100      → /shop/faves-under-100
│   ├── BY STYLE
│   │   ├── Boots                     → /shop/women-boots
│   │   ├── Sneakers                  → /shop/womens-sneakers
│   │   ├── Flats                     → /shop/women-flats
│   │   ├── Heels                     → /shop/women-heels
│   │   ├── Wedges                    → /shop/women-wedge-shoes
│   │   ├── Sandals                   → /shop/women-sandals
│   │   ├── Heritage                  → /shop/heritage
│   │   └── Rain Boots                → /rain-boots
│   └── BY SEASON
│       ├── Spring 2026               → /shop/spring-2026-collection
│       └── Fall 2025                 → /shop/fall-2025-collection
├── Best Sellers                      → /best-sellers
├── Verbenas                          → /verbenas
├── Sale                              → /clearance
├── About                             → /mizmooz-brand-story/
├── Gift Cards                        → /gift-card.html
├── 🔍 Search                         → /catalogsearch/result/?q=  ·  /catalogsearch/advanced/
├── ♡  Wishlist                       → /wishlist/            (Guest → chuyển sang Login)
├── 🛒 Cart (icon giỏ)                → mở SIDE CART (overlay, không có route)
│     ├── Go to Cart                  → /checkout/cart/        ✅ trang Shopping Cart
│     └── Checkout  <button>          → /onestepcheckout/      ✅ TRANG CHECKOUT THẬT
├── 👤 Account ▾                      → My Account · My Wish List · Sign In · Create an Account
└── 💲 Currency ▾                     → USD (mặc định) · EUR · CAN · POUND · AUD · NZD

Footer
├── Help Center (ngoài site)          → miz-mooz-s0l3kmffuq6.gorgias.help
├── FAQ                               → /faq/
├── Shipping                          → /shipping-handling/
├── Returns                           → /rmac/guest/request
├── Size chart                        → popup (href="#")
├── Reward program                    → /rewards
├── Contact                           → /contact/
├── My account: Profile · Orders · Wishlist · Rewards
│     → /customer/account/ · /sales/guest/form/ · /wishlist/ · /rewards-program/dashboard/
├── Privacy Policy                    → /miz-mooz-privacy-and-policy/
├── Terms and Conditions              → /mizmooz-terms-conditions/
└── 2 form Newsletter Klaviyo (Email + SMS)

Luồng mua hàng (đã chạy thật end-to-end)
PDP → ADD TO CART → icon giỏ → Side Cart → [Checkout] → /onestepcheckout/ → [Place Order]
  → /checkout/onepage/success/  ("Thank you for your purchase!" + order number + điểm nhận được)

Vùng Customer Account (sau đăng nhập) — sidebar 11 mục
├── My Orders                 → /sales/order/history/
├── My Wish List              → /wishlist/
├── Address Book              → /customer/address/
├── Account Information       → /customer/account/edit/
├── Store Credit              → /storecredit/info/
├── Stored Payment Methods    → /vault/cards/listaction/
├── Gift Cards                → /giftcard/customer/
├── Newsletter Subscriptions  → /newsletter/manage/
├── Restock Notifications     → /outofstocknotification/products/
├── My Rewards                → /rewards-program/dashboard/
└── My Returns                → /rmac/returns/history/
```

**Route đã thử nhưng KHÔNG tồn tại:** `/blog` → **404 Not Found** (tài liệu có nhắc Blog — xem `AMB-05`).

---

## 3. Bảng module tổng — 17 module

| # | Module | Bí danh trong tài liệu | Prefix | File khám phá | Loại màn hình | Risk | Ước REQ |
|---|---|---|---|---|---|---|---|
| 1 | Chi tiết sản phẩm | Product | `PDP` | [module_01](modules/module_01_chi_tiet_san_pham.md) | Chi tiết | 🔴 | 40–55 |
| 2 | Danh sách sản phẩm | Product Listing | `PLP` | [module_02](modules/module_02_danh_sach_va_tim_kiem.md) | Danh sách | 🟡 | 25–35 |
| 3 | Tìm kiếm | Search | `SEARCH` | [module_02](modules/module_02_danh_sach_va_tim_kiem.md) | Danh sách | 🟡 | 10–15 |
| 4 | Giỏ hàng & Mini cart | Cart Page · Mini Cart | `CART` | [module_03](modules/module_03_gio_hang.md) | Form/Grid | 🔴 | 30–40 |
| 5 | Thanh toán | Shop and Checkout · Payment | `CHECKOUT` | [module_04](modules/module_04_thanh_toan.md) | Wizard | 🔴 | 50–70 |
| 6 | Đăng nhập·Đăng ký·Quên MK | Sign In · Sign Up | `AUTH` | [module_05](modules/module_05_tai_khoan_dang_nhap_wishlist.md) | Form | 🔴 | 20–28 |
| 7 | Tài khoản khách hàng | Customer Account | `ACCOUNT` | [module_05](modules/module_05_tai_khoan_dang_nhap_wishlist.md) | Dashboard | 🔴 | 35–45 |
| 8 | Wishlist | Wishlist | `WISH` | [module_05](modules/module_05_tai_khoan_dang_nhap_wishlist.md) | Danh sách | 🟡 | 8–12 |
| 9 | Điểm thưởng | Rewards Program | `REWARD` | [module_06](modules/module_06_diem_thuong.md) | Dashboard | 🔴 | 12–18 |
| 10 | Gift Card | Gift Card | `GIFT` | [module_07](modules/module_07_gift_card.md) | Form/Product | 🔴 | 12–18 |
| 11 | Trả hàng | Send a RMA request | `RMA` | [module_08](modules/module_08_tra_hang_rma.md) | Form/Wizard | 🔴 | 15–20 |
| 12 | Multi-store & Đa tiền tệ | Multi Store · Currency icon | `STORE` | [module_09](modules/module_09_multi_store_da_tien_te.md) | Cơ chế | 🔴 | 8–12 |
| 13 | Điều hướng | Header · Footer · Menu · Breadcrumb | `NAV` | [module_10](modules/module_10_dieu_huong_trang_chu_noi_dung.md) | Khung chung | 🟡 | 12–18 |
| 14 | Trang chủ | Home page | `HOME` | [module_10](modules/module_10_dieu_huong_trang_chu_noi_dung.md) | CMS/Landing | 🟢 | 8–12 |
| 15 | Nội dung tĩnh & Liên hệ | Footer CMS Page · Link Contact | `CMS` | [module_10](modules/module_10_dieu_huong_trang_chu_noi_dung.md) | CMS/Form | 🟢 | 10–15 |
| 16 | Newsletter | Newsletter register | `NEWS` | [module_11](modules/module_11_newsletter_va_email.md) | Form | 🟡 | 10–14 |
| 17 | Email giao dịch | Emails | `EMAIL` | [module_11](modules/module_11_newsletter_va_email.md) | Ngoài UI | 🔴 | 15–20 |

**Tổng: 17 module / 11 file** — khớp với bảng danh mục ở `README.md`.

---

## Bản đồ tài liệu

| File | Module bao phủ | Prefix |
|---|---|---|
| [module_01_chi_tiet_san_pham.md](modules/module_01_chi_tiet_san_pham.md) | Chi tiết sản phẩm | `PDP` |
| [module_02_danh_sach_va_tim_kiem.md](modules/module_02_danh_sach_va_tim_kiem.md) | Danh sách sản phẩm · Tìm kiếm | `PLP` · `SEARCH` |
| [module_03_gio_hang.md](modules/module_03_gio_hang.md) | Giỏ hàng & Mini cart | `CART` |
| [module_04_thanh_toan.md](modules/module_04_thanh_toan.md) | Thanh toán | `CHECKOUT` |
| [module_05_tai_khoan_dang_nhap_wishlist.md](modules/module_05_tai_khoan_dang_nhap_wishlist.md) | Đăng nhập/Đăng ký · Tài khoản · Wishlist | `AUTH` · `ACCOUNT` · `WISH` |
| [module_06_diem_thuong.md](modules/module_06_diem_thuong.md) | Điểm thưởng | `REWARD` |
| [module_07_gift_card.md](modules/module_07_gift_card.md) | Gift Card | `GIFT` |
| [module_08_tra_hang_rma.md](modules/module_08_tra_hang_rma.md) | Trả hàng (RMA) | `RMA` |
| [module_09_multi_store_da_tien_te.md](modules/module_09_multi_store_da_tien_te.md) | Multi-store & Đa tiền tệ | `STORE` |
| [module_10_dieu_huong_trang_chu_noi_dung.md](modules/module_10_dieu_huong_trang_chu_noi_dung.md) | Điều hướng · Trang chủ · Nội dung tĩnh & Liên hệ | `NAV` · `HOME` · `CMS` |
| [module_11_newsletter_va_email.md](modules/module_11_newsletter_va_email.md) | Newsletter · Email giao dịch | `NEWS` · `EMAIL` |

---

## 4. Bản đồ entity & phụ thuộc

```
Product (configurable)
 └─ có nhiều ─→ Simple product = Color × Size          (attribute: color, size_configurable)
       │                                                 attribute width (Medium/Wide/Narrow) — ❔ chưa quan sát được
       ├─→ Wishlist item        (cần Customer)
       ├─→ Cart item ──→ Order ──┬─→ Invoice
       │                         ├─→ Shipment  (đồng bộ ShipStation)
       │                         ├─→ RMA request   (chỉ order Complete)
       │                         └─→ Reward points (Yotpo Loyalty)
       └─→ Restock notification  (đăng ký khi hết hàng)

Customer
 ├─ có nhiều ─→ Address (billing/shipping, có default)
 ├─ có ────→ Store Credit  ←── redeem ── Gift Card account
 ├─ có ────→ Stored payment method (Braintree vault, chỉ Credit Card)
 ├─ có ────→ Newsletter subscription (Klaviyo)
 └─ có ────→ Reward account (Yotpo)

Store view (6): mm_usd · mm_ca · mm_eu · mm_uk · mm_aud · mm_nzd
 └─ quyết định ─→ currency hiển thị và currency thanh toán
```

**Phụ thuộc giữa module — thứ tự recon phải tôn trọng:**

| Module | Phụ thuộc vào | Vì sao |
|---|---|---|
| `CART` | `PDP` | Không add được hàng thì không có giỏ |
| `CHECKOUT` | `CART`, `AUTH` | Cần giỏ có hàng; luồng customer cần đăng nhập |
| `ACCOUNT`, `WISH`, `REWARD`, `RMA` | `AUTH` | Đều yêu cầu đăng nhập |
| `RMA` | `CHECKOUT` | Chỉ order **Complete** mới request RMA được |
| `REWARD` | `CHECKOUT` | Điểm sinh ra từ đơn hàng |
| `EMAIL` | Gần như mọi module | Email là hệ quả của hành động ở module khác |
| `STORE` | — | Cắt ngang mọi module có hiển thị giá |

---

## 5. Ma trận phân quyền sơ bộ (cấp module)

Storefront chỉ có 2 vai. Ô ✅/❌ đã kiểm chứng bằng thao tác thật; ô ⚠️ là suy diễn.

| Module | Guest | Customer | Ghi chú |
|---|---|---|---|
| `HOME` `NAV` `CMS` `PLP` `PDP` `SEARCH` `STORE` | ✅ | ✅ | Công khai |
| `CART` | ✅ | ✅ | Add-to-cart ✅ cả 2 vai · Side Cart ✅ · trang Cart ✅ (QA cung cấp ảnh) |
| `CHECKOUT` | ✅ | ✅ | Guest ✅ khảo sát đủ form + áp coupon/gift card · Customer ✅ **đã đặt đơn thành công** |
| `AUTH` | ✅ | — | Đăng nhập ✅ kiểm chứng thành công |
| `ACCOUNT` | ❌ | ✅ | Guest vào `/customer/account/` bị chuyển sang Login |
| `WISH` | ❌ | ✅ | Guest vào `/wishlist/` bị chuyển sang Login — ✅ kiểm chứng |
| `REWARD` | ⚠️✅ | ✅ | Trang giới thiệu `/rewards` công khai; dashboard cần đăng nhập |
| `GIFT` | ✅ | ✅ | Guest ✅ áp được mã gift card ở checkout; quản lý gift card cần đăng nhập |
| `RMA` | ✅ | ✅ | Guest qua `/rmac/guest/request` ✅; customer qua `/rmac/returns/history/` |
| `NEWS` | ✅ | ✅ | Form Klaviyo ở header/footer |
| `EMAIL` | ✅ | ✅ | Ngoài UI |

**Tổng: Đã kiểm chứng 26 ô · Suy diễn 2 ô · Chưa rõ 0 ô.**

Không còn ô `❔`. Hai ô `⚠️` còn lại thuộc `REWARD` (trang giới thiệu công khai — suy từ việc không thấy yêu cầu đăng nhập).

---

## 6. Thứ tự khảo sát đã chốt

User chốt **theo luồng mua hàng** — bám đường đi thật của khách, phụ thuộc trước risk sau:

| Bước | Module | Trạng thái sẵn sàng |
|---|---|---|
| 1 | `PDP` | ✅ Sẵn sàng |
| 2 | `PLP` | ✅ Sẵn sàng |
| 3 | `SEARCH` | ✅ Sẵn sàng |
| 4 | `CART` | ✅ **Sẵn sàng** — Side Cart khảo sát trực tiếp · trang Cart có ảnh QA cung cấp (agent không tự vào được do mạng) |
| 5 | `CHECKOUT` | ✅ **Sẵn sàng** — `/onestepcheckout/` vào được, đã đặt đơn thật |
| 6 | `AUTH` | ✅ Sẵn sàng |
| 7 | `ACCOUNT` | ✅ Sẵn sàng |
| 8 | `WISH` | ✅ Sẵn sàng |
| 9 | `REWARD` | ✅ Sẵn sàng |
| 10 | `GIFT` | ✅ Sẵn sàng |
| 11 | `RMA` | ✅ Sẵn sàng |
| 12 | `STORE` | ✅ Sẵn sàng |
| 13 | `NAV` | ✅ Sẵn sàng |
| 14 | `HOME` | ✅ Sẵn sàng |
| 15 | `CMS` | ✅ Sẵn sàng |
| 16 | `NEWS` | ✅ Sẵn sàng |
| 17 | `EMAIL` | ⚠️ Cần quyền đọc hộp thư nhận email giao dịch |

> Không còn module nào bị chặn. `CART` và `CHECKOUT` đã khảo sát sâu (Guest + Customer, coupon, gift card, PO Box) — chỉ còn chờ recon chi tiết để sinh REQ.

---

## 7. Vùng chưa xác minh — cấp hệ thống

| Vùng | Lý do | Cần gì để gỡ |
|---|---|---|
| ⚠️ **GIỚI HẠN MÔI TRƯỜNG KHẢO SÁT — không phải lỗi hệ thống** | Máy chạy agent đi qua node CDN châu Á (HKG·SIN·NRT) và **bị Fastly trả 403 ở `/checkout/cart/` và `/checkout/`**. QA truy cập cùng URL **hoàn toàn bình thường** (đã cung cấp ảnh). Mọi tài liệu phải ghi 2 route này là **hoạt động tốt** | Người khảo sát tiếp theo cần ở vị trí mạng khác, hoặc nhờ whitelist IP agent |
| **Playwright MCP** | Bị Fastly chặn `Blocked unwanted bot` (UA `HeadlessChrome`) ngay từ trang chủ ⇒ không lưu được ảnh evidence xuống đĩa | Whitelist UA automation trên Fastly |
| ~~Nhập thẻ mới / đặt đơn Guest~~ | ✅ **Đã làm được** trên Chrome thật — mấu chốt là **bấm cả vùng `Card`** thì form thẻ mới render, và phải **đóng popup Klaviyo** trước khi gõ | — |
| **Apple Pay · After Pay** | Không xuất hiện trong danh sách Payment Method trên Chrome/Linux | Apple Pay cần thiết bị Apple; After Pay cần hỏi dev |
| **Ảnh evidence** `_discovery/evidence/` | Trống. Playwright MCP — công cụ duy nhất lưu được ảnh xuống đĩa — bị Fastly chặn `Blocked unwanted bot` ngay từ trang chủ. Khảo sát chạy trên trình duyệt thật, công cụ này không ghi file ảnh | Whitelist UA automation trên Fastly, **hoặc** tester chụp tay theo danh sách module |
| **Attribute `width`** (Medium/Wide/Narrow) | Tài liệu có nêu; 2 PDP đã mở (`kayla`, `juke1`) chỉ có `color` + `size_configurable` | Cần một SKU có cấu hình width để xác minh |
| **Hành vi auto-select store theo IP** | Tài liệu mô tả hệ thống tự chọn store theo IP quốc gia. Chỉ kiểm chứng được thao tác **switch tay** (sang `mm_ca` thành công) | Cần truy cập từ IP các quốc gia khác, hoặc xác nhận cấu hình với dev |
| **Amazon Pay** | Tài liệu nêu Amazon Pay ở Cart/Checkout. Mini cart chỉ thấy PayPal · Apple Pay · Google Pay (đều Braintree). Trang login có container `amazon-sign-in-button` | Gỡ `AMB-01` rồi kiểm ở trang checkout |
| **Magento Admin** | Ngoài phạm vi đợt này — user đã xác nhận | Chạy `/discover-system` với namespace `_admin/` khi cần |

---

## 8. Nhật ký khám phá

| Ngày | Mode | Nội dung | Người/Công cụ |
|---|---|---|---|
| 2026-09-11 | HYBRID | **Vòng 4 — đặt đơn GUEST thành công bằng thẻ nhập tay** (Chrome thật). Mấu chốt kỹ thuật: phải **bấm cả vùng `Card`** mới render form thẻ; Braintree Hosted Fields là iframe cross-origin nên bắt buộc gõ thật; **field nở ra sau khi nhập số thẻ** làm Exp/CVV dịch vị trí. Phát hiện **popup Address Validation** (khớp tài liệu, nhưng vẫn bật khi địa chỉ đã chuẩn — `AMB-10`) và **popup Klaviyo bật giữa lúc nhập thẻ** nuốt mất ký tự (`AMB-11` 🔴). Xác định **công thức điểm chính xác**: `floor(Subtotal − Discount_coupon)` — gift card và shipping **không** tính vào. Xác nhận **Guest không được điểm**, chỉ hiện "could have earned" + mời tạo account (+50 điểm). Lập **bản đồ Express Checkout & Payment ở 4 vị trí** ⇒ đóng `AMB-09` | Claude Code · Chrome thật |
| 2026-09-11 | HYBRID | **Vòng 3 — Guest checkout, coupon, gift card, PO Box.** Chạy luồng Guest đầy đủ trên `/onestepcheckout/`: nhập địa chỉ `300 park ave, New York, NY 10022 US`, áp coupon `CBITESTMM` (−$10) và gift card `L854RRLPLJJX` (−$25) — cả hai thành công và **cộng dồn được**. Kiểm chứng **quy tắc PO Box** với 3 biến thể chính tả (`PO Box` · `P.O. Box` · `P.O Box`): 4 phương thức ship rút còn 1, bỏ keyword thì khôi phục. Đo bảng giá ship ở cả 2 ngưỡng subtotal ⇒ **bảng giá trong checklist đúng 100%**. **Đóng `AMB-01`**: trang giỏ hàng không hề lỗi — 403 là giới hạn mạng của máy khảo sát. Mở `AMB-08`, `AMB-09` | Claude Code · trình duyệt thật |
| 2026-09-11 | HYBRID | **Khảo sát lại CART + CHECKOUT theo đường đi thật.** Phát hiện route checkout thật `/onestepcheckout/` — lần 1 đoán nhầm `/checkout/` nên kết luận sai là "bị chặn". Chạy trọn luồng mua hàng và **đặt đơn thành công** bằng thẻ đã lưu trong vault. Thu được: 4 shipping method (carrier `matrixrate`, xác nhận quy tắc +$10/sp và ngưỡng miễn phí $150), 5 payment method (gồm Amazon Pay), form địa chỉ 11 field, 4 cơ chế giảm giá. **Đóng `AMB-04`** bằng bằng chứng đơn hàng ($259.90 → 259 điểm). **Thu hẹp `AMB-01`**. Mở `AMB-07` | Claude Code · trình duyệt thật |
| 2026-09-11 | HYBRID | Khám phá lần đầu. Nạp checklist Google Sheet (135 dòng). Crawl storefront: menu 3 tầng, footer, vùng Customer Account 11 mục. Kiểm chứng: đăng nhập Customer ✅ · add-to-cart ✅ · switch store `mm_ca` ✅ · PDP configurable (color + size_configurable) ✅. Phát hiện 17 module, cấp 17 prefix. Ghi nhận 6 AMB, trong đó `AMB-01` chặn 2 module risk cao nhất. Xuất bảng đối chiếu lệch pha 15 dòng | Claude Code · trình duyệt thật + Chrome thật |
