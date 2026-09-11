# BẢN ĐỒ PHỦ TÀI LIỆU — Miz Mooz

← Quay lại [`system_map.md`](system_map.md) · Danh mục [`../README.md`](../README.md)

> Mode **HYBRID**: tài liệu cho biết **ý định**, UI cho biết **thực tế**. Mọi lệch pha giữa hai nguồn đều là thông tin có giá trị, **không** vứt bên nào đi.

---

## 1. Tài liệu đã nạp

| Tài liệu | Nguồn | Ngày nạp | Quy mô | Bản gốc |
|---|---|---|---|---|
| Checklist function cơ bản | Google Sheet `1tJLfIUO7Yk0sd-XKg8I6X2730hlWCvuco2dEhulZW8Q` (gid=0) | 2026-09-11 | 135 dòng × 3 cột (`Page/Functions` · `Features` · `Expected`) | [`sources/checklist_function_co_ban_googlesheet.md`](sources/checklist_function_co_ban_googlesheet.md) |

**Tính chất tài liệu:** đây là **checklist kiểm thử**, không phải đặc tả yêu cầu. Nó mô tả *cần kiểm cái gì và kỳ vọng ra sao*, nhưng **không** có: field spec chi tiết, nguyên văn thông báo lỗi, ma trận phân quyền, ma trận trạng thái. Vì vậy kể cả vùng 🟩 vẫn phải recon UI để lấy nguyên văn message và danh sách field.

---

## 2. Bản đồ phủ theo module

| Module | Prefix | Tài liệu phủ ở đâu | Mức phủ | Hệ quả cho recon |
|---|---|---|---|---|
| Chi tiết sản phẩm | `PDP` | "Product" — 16 dòng, rất chi tiết (giá, variant, ảnh, OOS, pre-order, shipping info) | 🟩 Đầy đủ | Recon để **đối chiếu**, tập trung tìm lệch pha |
| Danh sách sản phẩm | `PLP` | "Product Listing" — 8 dòng | 🟩 Đầy đủ | Đối chiếu — **đã thấy 2 điểm lệch** |
| Tìm kiếm | `SEARCH` | "Search" — 3 dòng | 🟩 Đầy đủ | Đối chiếu |
| Giỏ hàng | `CART` | "Cart Page" 9 dòng + "Mini Cart" 7 dòng | 🟩 Đầy đủ | ✅ Side Cart recon trực tiếp · trang Cart qua ảnh QA |
| Thanh toán | `CHECKOUT` | "Shop and Checkout" 19 dòng + "Payment" 5 + "Tax and Shipping" 2 | 🟩 Đầy đủ | ✅ Recon sâu: Guest + Customer, coupon, gift card, PO Box, đặt đơn thật |
| Đăng nhập/Đăng ký | `AUTH` | "Sign In" 2 dòng + "Sign Up" 2 dòng | 🟩 Đầy đủ | Đối chiếu — **đã thấy 2 điểm lệch** |
| Tài khoản | `ACCOUNT` | "Customer Account" — 12 dòng | 🟩 Đầy đủ | Đối chiếu |
| Wishlist | `WISH` | Rải rác ở "Header", "Product", "Customer Account" — **không có mục riêng** | 🟨 Một phần | Recon **bổ khuyết**: comment trong wishlist, add-to-cart từ wishlist |
| Điểm thưởng | `REWARD` | "Rewards Program" — 3 dòng, rất ngắn | 🟨 Một phần | Recon bổ khuyết — **công thức điểm đang mâu thuẫn** |
| Gift Card | `GIFT` | Rải rác ở "Product", "Shop and Checkout", "Customer Account" | 🟨 Một phần | Recon bổ khuyết: validation field, luồng redeem |
| Trả hàng | `RMA` | "Send a RMA request" — 1 dòng dài | 🟨 Một phần | Recon bổ khuyết: các bước sau `Continue`, Rule RMA |
| Multi-store | `STORE` | "Currency icon" + "Multi Store" — 2 dòng chi tiết | 🟩 Đầy đủ | Đối chiếu — **ràng buộc "chỉ tích điểm khi mua USD" là phát hiện mới từ UI** |
| Điều hướng | `NAV` | "Header" 6 + "Footer" 4 + "Menu" 3 + "Breadcrumb" 1 | 🟩 Đầy đủ | Đối chiếu — **đã thấy lệch pha Blog** |
| Trang chủ | `HOME` | "Home page" — 7 dòng | 🟩 Đầy đủ | Đối chiếu — **popup Spin-to-Win không có trong tài liệu** |
| Nội dung tĩnh & Liên hệ | `CMS` | "Footer > CMS Page" + "Link Contact" — 2 dòng | 🟨 Một phần | Recon bổ khuyết: field phân loại của form Contact |
| Newsletter | `NEWS` | "Newsletter register" ×2 + "Newsletters" | 🟩 Đầy đủ | Đối chiếu |
| Email giao dịch | `EMAIL` | "Emails" — 12 dòng | 🟩 Đầy đủ | Cần quyền đọc hộp thư để kiểm chứng |

**Tổng: 🟩 Đầy đủ 11 module · 🟨 Một phần 6 module · ⬜ Trắng 0 module.**

### Vùng tài liệu nói mà chưa gán được vào module nào

Các dòng ở nhóm "Other functions Rules" và "Payment" mô tả **hành vi phía admin/backoffice**, nằm ngoài phạm vi storefront đợt này:

| Dòng tài liệu | Xử lý |
|---|---|
| Ship ở ShipStation (sync order, create label, invoice) | Ngoài phạm vi — thuộc Magento Admin |
| Update status order khi chưa invoice (`Processing Amazon Issue` / `Processing Afterpay Issue`) | Ngoài phạm vi storefront; nhưng **tên trạng thái** có thể hiện ở `ACCOUNT` > My Orders |
| Multi warehouse shipping | Ngoài phạm vi |
| Add expired date cho coupon sinh từ cart price rule | Cấu hình admin; hệ quả kiểm ở `CHECKOUT` |
| Automated Tax Calculation (TaxJar) | Hệ quả kiểm ở `CHECKOUT` |
| Live chat support · Accessibility | Đã xác nhận tồn tại qua network (Gorgias · UserWay) — gán vào `NAV` |

---

## 3. Bảng lệch pha tài liệu ↔ UI

Đây là sản phẩm chính của mode HYBRID. **UI thắng** ở mọi dòng — tài liệu ghi lại để biết ý định ban đầu.

| # | Hạng mục | Tài liệu nói | UI thực tế (2026-09-11) | Module | Mã |
|---|---|---|---|---|---|
| 1 | Số sp/trang Best Sellers | 22 sp/page ở trang đầu | `Items 1-18 of 57` → **18** | `PLP` `NAV` | `AMB-05` |
| 2 | Tuỳ chọn Sort By | Có **bestseller**, là mặc định | Chỉ `Newest` · `Price: Low to High` · `Price: High to Low` | `PLP` | `AMB-05` |
| 3 | Blog | Có trong menu, có mục riêng | Menu không có Blog · `/blog` → **404** | `NAV` | `AMB-05` |
| 4 | Công thức điểm thưởng | `point = (Subtotal − Discount) × 5` | **Đơn thật $259.90 → 259 điểm** ⇒ 1 điểm/$1. Tài liệu SAI | `REWARD` | ✅ `AMB-04` đã đóng |
| 5 | Captcha form Sign Up | **Bắt buộc phải có** | Không có element captcha trong DOM | `AUTH` | `AMB-03` |
| 6 | Checkbox "Show Password" | Có ở form Sign Up | Không thấy trong DOM | `AUTH` | `AMB-03` |
| 7 | Express checkout ở Cart | Amazon · PayPal · Google Pay · Apple Pay | Side cart có PayPal · Pay Later · Google Pay. **Amazon Pay không có ở side cart nhưng CÓ ở `/onestepcheckout/`** | `CART` | — |
| 8 | Ảnh trang chủ | Hiển thị đúng ảnh đã config | Nhiều chỗ hiện `File is not exist on server.` | `HOME` | `AMB-06` |
| 9 | Trang giỏ hàng `/checkout/cart/` | Mô tả đầy đủ, "chức năng quan trọng" | ✅ **Hoạt động bình thường** — QA cung cấp ảnh. Bảng 4 cột `Product·Price·Quantity·Subtotal`, tab `Estimate Shipping and Tax` / `Promo Codes`, `Continue Shopping`, `Update Shopping Cart` | `CART` | ✅ `AMB-01` đã đóng |
| 23 | Express checkout / Payment method | Cart có Amazon · PayPal · Google Pay · Apple Pay; Payment method có thêm After Pay | **4 vị trí, nội dung khác nhau** — Cart: PayPal·Pay Later · Side Cart: +G Pay · Express Checkout: +G Pay · Payment Method: Card·PayPal/Pay Later·Google Pay·Amazon Pay (+thẻ vault nếu đăng nhập). **Apple Pay** và **After Pay** KHÔNG xuất hiện | `CART` `CHECKOUT` | ✅ `AMB-09` đã đóng — lấy thực tế làm chuẩn |
| 24 | Tính thuế qua **TaxJar** | "Phải tính tax chính xác theo rate của Taxjar" | Cả 2 đơn test đều ra **Tax $0.00** — Kansas 66047 **và** New York NY 10022 (bang có thuế). Nghi TaxJar chưa cấu hình trên staging | `CHECKOUT` | `AMB-08` |
| 10 | Bộ lọc trang Search | "giống trang category" (có Price) | Chỉ Type · Size · Color — **không có Price** | `SEARCH` | — |

### ✅ Tài liệu ĐÚNG — đã kiểm chứng bằng thao tác thật

| Hạng mục | Bằng chứng |
|---|---|
| **Bảng giá shipping** (cả 2 ngưỡng subtotal) | Đo ở `$129.95` (<$150): Economy $10 · Standard $15 · Priority $25 · Express $45. Đo ở `$259.90` (>$150): Economy $0 · Standard $15 · Priority $35 · Express $55 ⇒ ngưỡng $150 **đúng**, quy tắc **+$10/sp** cho Priority/Express **đúng**, Standard không áp quy tắc đó |
| **Quy tắc PO Box** | 3 biến thể `PO Box` · `P.O. Box` · `P.O Box` đều rút 4 phương thức xuống còn 1 (rẻ nhất); bỏ keyword thì khôi phục đủ 4 |
| **Công thức Grand Total** | `129.95 − 25 (gift card) + 10 (ship) − 10 (coupon) + 0 (tax) = 104.95` ✅ |
| **Coupon + Gift Card cộng dồn** | Áp đồng thời `CBITESTMM` và `L854RRLPLJJX` trên cùng một đơn, cả hai cùng hiệu lực |
| **Guest không dùng được Store Credit / điểm** | UI hiện `To use store credit, please Login`, không có khối điểm thưởng |
| **Có EST date delivery** | Standard/Priority/Express đều hiển thị `(est delivery: …)` |
| **Công thức điểm** — phần `(Subtotal − Discount)` của tài liệu đúng | 2 đơn: `floor(259.90−0)=259` ✅ · `floor(129.95−10)=119` ✅. Chỉ hệ số ×5 là sai (thực tế ×1) |
| **Validation Address** có thật | Popup `Address Validation` bật sau khi nhập địa chỉ, có `Confirm` / `GO BACK` |
| **Guest không có store credit và point reward** | Guest: `To use store credit, please Login`; trang Thank you ghi `You could have earned N points` |
| **Guest checkout được** | Đã đặt đơn Guest thành công `$104.95` bằng thẻ test nhập tay |
| **Create Account sau khi checkout** | Trang Thank you của Guest có nút `Create an Account` + ưu đãi `+50 points` |

### UI có — tài liệu KHÔNG nói

| # | Phát hiện | Module | Vì sao đáng ghi |
|---|---|---|---|
| 11 | **Popup Klaviyo "Spin to Win"** — vòng quay 5–20% Off, che toàn màn hình ở trang chủ và trang Sign In | `HOME` `NEWS` `AUTH` | Chặn tương tác, từng làm đăng nhập thất bại âm thầm. Rủi ro cao nhất cho automation |
| 12 | **Ràng buộc "chỉ tích điểm khi mua bằng USD"** (`*Points can only be earned when shopping in USD`) | `REWARD` `STORE` | Cắt ngang 5 store view không phải USD |
| 13 | **Restock Notifications** có màn hình riêng `/outofstocknotification/products/` | `ACCOUNT` `PDP` | Tài liệu chỉ ghi tên, để trống phần Expected |
| 14 | **Advanced Search** tại `/catalogsearch/advanced/` | `SEARCH` | Không được nhắc tới |
| 15 | **2 lối vào trả hàng khác nhau**: `/rmac/guest/request` (Amasty) và `/sales/guest/form/` (Magento chuẩn), field khác nhau | `RMA` | Tài liệu gộp thành một ý |
| 16 | Form Contact có 2 select phân loại `i_am_a` · `writing_from` và honeypot `hideit` | `CMS` | Tài liệu chỉ mô tả chung |
| 17 | Danh sách **tích hợp bên thứ ba** đầy đủ: Klaviyo · Yotpo · Gorgias · Afterpay · PayPal Braintree · UserWay · MagePal GTM · Criteo · Facebook | Toàn site | Tài liệu nhắc lẻ tẻ, không liệt kê tập trung |
| 18 | **Route checkout thật là `/onestepcheckout/`**, không phải `/checkout/` mặc định Magento. Nút `Checkout` ở Side Cart là `<button>` không có `href` | `CART` `CHECKOUT` | Không đọc được bằng cách quét link — phải bấm mới ra |
| 19 | Giảm giá dùng **Mageplaza Multiple Coupons** (`mpmultiplecoupons_code`); gift card có nút **`See Balance`** | `CHECKOUT` `GIFT` | Tài liệu nêu "Multiple Coupons Extensions" nhưng không nói tên |
| 20 | Checkout cho **chỉnh số lượng item** ngay tại trang (nút −/+) | `CHECKOUT` | Tài liệu không nhắc |
| 21 | Shipping dùng carrier **`matrixrate`**, 4 phương thức, **có EST date delivery** | `CHECKOUT` | ✅ Xác nhận quy tắc `+$10/sp` và ngưỡng miễn phí `$150` của tài liệu là **đúng** |
| 22 | Trang Thank you hiển thị **`You earned N points for this order`** + link `View your rewards` + khối `Share your new shoes!` | `CHECKOUT` `REWARD` | Tài liệu chỉ nêu chung "show điểm mà user nhận được" |
| 25 | Guest checkout có **`Join the newsletter and keep in touch`** (`osc-newsletter`) tách riêng khỏi `Subscribe for SMS updates` | `CHECKOUT` `NEWS` | Tài liệu gộp thành "Register Newsletter when checkout" |
| 26 | Gift card có nút **`See Balance`** và dòng **`Remove Gift Cards (<mã>)`** cho phép gỡ ngay trên Summary | `CHECKOUT` `GIFT` | Tài liệu không mô tả thao tác gỡ |
| 27 | Coupon hiển thị dạng **chip có nút `X`** để gỡ, message nguyên văn `Apply discount code successfully.` | `CHECKOUT` | Tài liệu không nêu message |
| 28 | Khi thiếu địa chỉ, khối shipping hiện nguyên văn **`Sorry, no quotes are available for this order at this time. Please check your shipping address and try again.`** — xuất hiện ở **cả** trang Cart lẫn `/onestepcheckout/` | `CART` `CHECKOUT` | Tài liệu không nêu |
| 30 | **Popup Klaviyo thứ hai** (`Where should we send it?` / `GET DISCOUNT NOW`) bật **giữa lúc nhập thẻ** ở trang checkout, nuốt ký tự đang gõ | `CHECKOUT` `NEWS` | Rủi ro thật với khách đang thanh toán — `AMB-11` 🔴 |
| 31 | Popup **Address Validation** vẫn bật khi địa chỉ đã chuẩn, 2 lựa chọn giống hệt nhau | `CHECKOUT` | `AMB-10` |
| 32 | Form thẻ **chỉ hiện khi bấm cả vùng `Card`**, không phải chỉ tích radio | `CHECKOUT` | Bẫy lớn cho automation |
| 33 | Trang Thank you của **Guest** khác Customer: `Your order # is:` (thay vì `Your order number is:`), `You could have earned N points`, nút `Create an Account` + `+50 points` | `CHECKOUT` `REWARD` `AUTH` | Tài liệu mô tả chung một kiểu |
| 34 | Logo thẻ chấp nhận: **Visa · Mastercard · AMEX · JCB · Discover**; nhập đúng số thì **viền xanh** và **logo lọc còn đúng hãng** | `CHECKOUT` | Tín hiệu tốt để assert |
| 29 | **Tên phương thức Economy đổi theo ngưỡng $150**: `Economy Shipping on Orders Under $150` ($10) ↔ `Free Economy Shipping on Orders Over $150` ($0) — là **2 rate riêng**, không phải 1 rate đổi giá | `CHECKOUT` | Tài liệu chỉ nói giá, không nói tên đổi |

---

## 4. Bản đối chiếu xuất ra cho QA

File Excel có **tô cam 15 dòng lệch pha**, giữ nguyên 135 dòng gốc và thêm 2 cột `Trạng thái đối chiếu UI` · `Ghi chú thực tế`:

📄 [`checklist_doi_chieu_UI_2026-09-11.xlsx`](checklist_doi_chieu_UI_2026-09-11.xlsx) — bản cập nhật sau lần khảo sát 2

Dùng để import đè lên Google Sheet gốc.

> ℹ️ Connector Google Drive hiện chỉ đổi được **tên file và thư mục**, **không ghi được nội dung ô** và không tô màu được — nên bản cập nhật phải đi đường file Excel.
