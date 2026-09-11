# Module 04 — Thanh toán (CHECKOUT)

← Quay lại [`system_map.md`](../system_map.md) · Trạng thái recon tra ở [`README.md`](../../README.md)

| | |
|---|---|
| Prefix | `CHECKOUT` |
| Bí danh trong tài liệu | "Shop and Checkout (chức năng quan trọng)" · "Payment" · "Tax and Shipping" · "Shop & Checkout - International Customers" |
| **Route thật** | **`/onestepcheckout/`** — title trang: `One Step Checkout` |
| Route trang thành công | `/checkout/onepage/success/` — title: `Success Page` |
| Cách tới | Bấm nút **`Checkout`** trong **Side Cart**. Nút này là `<button>` **KHÔNG có `href`** — điều hướng bằng JS |
| Loại màn hình | One Step Checkout — tất cả trên một trang, 2 cột |
| Risk | 🔴 Cao nhất toàn hệ thống |
| Ước REQ | 50–70 |

> ⚠️ **Đính chính (2026-09-11, lần khảo sát 2).** Lần 1 tôi ghi route checkout là `/checkout/` theo mặc định Magento — **SAI**. Site dùng module One Step Checkout với route riêng `/onestepcheckout/`. Kết luận "Fastly chặn toàn bộ checkout" ở lần 1 vì thế **không đúng**: trang checkout vào được bình thường và **đã đặt hàng thành công**. Xem mục "Bài học" ở cuối.

---

## Đã kiểm chứng đầy đủ (2026-09-11) — có đặt đơn hàng thật

Luồng chạy thật: PDP → chọn size → `ADD TO CART` → bấm icon giỏ → Side Cart → `Checkout` → `/onestepcheckout/` → chọn thẻ đã lưu → `Place Order` → trang Thank you.

### Bố cục trang

| Cột | Khối |
|---|---|
| **Trái** | Express Checkout · Shipping Address · Shipping Method · Payment Method · Store Credit |
| **Phải** | Điểm thưởng · Danh sách item · Discount code · Gift Card code · Summary · `Place Order` |

### Express Checkout (đầu trang)

`PayPal` · `Pay Later` · `G Pay` — 3 nút, nằm **trên cùng** trước cả địa chỉ.

#### 📋 Bản đồ Express Checkout & Payment — 4 vị trí, nội dung KHÁC NHAU

Đây là thực tế đã kiểm chứng, thay cho mô tả gộp của tài liệu:

| Vị trí | Nội dung thực tế |
|---|---|
| **Trang Cart** `/checkout/cart/` | `PayPal` · `Pay Later` |
| **Side Cart** (overlay) | `PayPal` · `Pay Later` · `G Pay` |
| **Express Checkout** (đầu `/onestepcheckout/`) | `PayPal` · `Pay Later` · `G Pay` |
| **Payment Method** (`/onestepcheckout/`) | `Card` · `PayPal / Pay Later` · `Google Pay` · `Amazon Pay` **+** thẻ đã lưu `braintree_cc_vault_*` (chỉ khi đã đăng nhập) |

**Chốt lại so với tài liệu:**

| Tài liệu nói | Thực tế |
|---|---|
| Cart có Amazon · PayPal · Google Pay · Apple Pay | Cart chỉ có **PayPal · Pay Later**. Amazon Pay **chỉ** ở Payment Method của trang checkout |
| Payment method có **Apple Pay** | **Không xuất hiện** trên Chrome/Linux — Apple Pay chỉ khả dụng trên Safari/iOS/macOS, cần thiết bị Apple để kiểm |
| Payment method có **After Pay** | **Không xuất hiện** trong danh sách Payment Method, dù thư viện Afterpay có được nạp ở mini cart. Cần xác nhận đã tắt hay chỉ hiện theo điều kiện (ngưỡng giá trị đơn?) |

### Shipping Address

- Hiển thị **các địa chỉ đã lưu** dạng thẻ chọn, 1 thẻ được chọn sẵn (viền cam + dấu tick)
- Nút **`New Address`** mở form
- Checkbox **`My shipping and billing addresses are the same`** → khi bỏ tick sẽ hiện khối **Billing Address** riêng (`billing_address_id`)
- Checkbox **`Subscribe for SMS updates`** → field `custom_attributes[kl_sms_consent]` (Klaviyo)

**Form New Address — 11 field.** Dấu `*` trên nhãn là căn cứ bắt buộc (thuộc tính DOM `required` **không** đáng tin ở form này):

| Nhãn hiển thị | Field name | Bắt buộc |
|---|---|---|
| First Name * | `firstname` | ✅ |
| Last Name * | `lastname` | ✅ |
| Street Address * | `street[0]` | ✅ — placeholder **`Enter a location`** → có gợi ý địa chỉ Google |
| Street Address: Line 2 | `street[1]` | ❌ — placeholder `Apartment, suite, etc. (optional)` |
| Country * | `country_id` (select) | ✅ |
| City * | `city` | ✅ |
| State/Province * | `region` / `region_id` (select) | ✅ — có cả ô text và select |
| Zip/Postal Code * | `postcode` | ✅ |
| Company | `company` | ❌ |
| Phone Number * | `telephone` | ✅ |
| Save in address book | `shipping-save-in-address-book` (checkbox) | — |

#### ⭐ Popup **Address Validation** — đã kiểm chứng

Sau khi nhập xong địa chỉ (điền tới field cuối), hệ thống **tự bật popup** so khớp với dịch vụ chuẩn hoá địa chỉ:

```
Address Validation                                    [×]
─────────────────────────────────────────────────────────
Choose original address:
  ( ) 300 Park Ave, New York New York 10022, United States

Choose suggested address:
  (•) 300 Park Ave, New York New York 10022, United States

                                   [ GO BACK ]  [ Confirm ]
```

| Nút | Hành vi |
|---|---|
| **`Confirm`** | Áp địa chỉ đang chọn (radio) và đóng popup → shipping quotes được tính lại |
| **`GO BACK`** | Giữ nguyên địa chỉ người dùng đã nhập, không áp gợi ý |
| **`×`** | Đóng popup |

✅ Đây chính là **"Validation Address"** mà tài liệu yêu cầu — **có thật**.

⚠️ **Điểm đáng ngờ (`AMB-10`):** khi nhập địa chỉ **đã chuẩn** (`300 park ave / New York / NY / 10022`), popup **vẫn bật** và hai lựa chọn **giống hệt nhau từng ký tự**. Bắt người dùng xác nhận giữa hai thứ y hệt là ma sát thừa trong luồng thanh toán. (Khi nhập sai zip — ví dụ `10021` — popup gợi ý đúng `10022`, lúc đó popup mới có ý nghĩa.)

⚠️ **Với automation:** popup này **chặn mọi thao tác phía sau**. Script phải chờ nó xuất hiện và bấm `Confirm`/`GO BACK` trước khi đi tiếp, nếu không sẽ treo ở bước chọn shipping.

### Shipping Method — carrier `matrixrate`

Mã option dạng `matrixrate_matrixrate_<id>` → **Matrix Rate**, khớp tài liệu ("Flat Rate (Matrix)").

Đã đo ở **cả hai ngưỡng subtotal** — bảng giá của tài liệu **đúng 100%**:

| Phương thức | 1 sp · $129.95 (**< $150**) | 2 sp · $259.90 (**> $150**) | Tài liệu |
|---|---|---|---|
| Economy | `Economy Shipping on Orders **Under** $150` — **$10.00** | `Free Economy Shipping on Orders **Over** $150` — **$0.00** | "< $150 → Economy $10" · "> $150 → Economy $0" ✅ |
| Standard *(est delivery)* | $15.00 | $15.00 | $15 ✅ — **không** áp quy tắc +$10/sp |
| Priority *(est delivery)* | $25.00 | $35.00 | $25 + $10/sp ✅ |
| Express *(est delivery)* | $45.00 | $55.00 | $45 + $10/sp ✅ |

- **Tên phương thức Economy đổi theo ngưỡng** — `Under $150` (mất phí) ↔ `Over $150` (miễn phí). Đây là 2 rate riêng, không phải 1 rate đổi giá
- Mã option: `matrixrate_matrixrate_3523` · `_3517` · `_3526` · `_3520`
- ✅ Có **EST date delivery** ở Standard/Priority/Express; Economy ghi khoảng `8-10 business days`
- Khi **chưa đủ địa chỉ**, khối shipping hiện nguyên văn: **`Sorry, no quotes are available for this order at this time. Please check your shipping address and try again.`**

#### ⭐ Quy tắc PO Box — ĐÃ KIỂM CHỨNG ĐẦY ĐỦ

Tài liệu: *"Address có text PO Box, P.O. Box, P.O Box thì chỉ tracking 1 shipping free thôi"*. Thử trên địa chỉ `300 park ave, New York, New York, 10022, US`:

| `Street Address` | Số phương thức trả về | Kết quả |
|---|---|---|
| `300 park ave` | **4** — Economy $10 · Standard $15 · Priority $25 · Express $45 | Bình thường |
| `300 park ave **PO Box** 123` | **1** — chỉ `Economy Shipping on Orders Under $150` $10.00 | ✅ Rule kích hoạt |
| `300 park ave **P.O. Box** 456` | **1** — như trên | ✅ Rule kích hoạt |
| `300 park ave **P.O Box** 789` | **1** — như trên | ✅ Rule kích hoạt |
| `300 park ave` (trả lại) | **4** — quay lại đầy đủ | ✅ Đảo ngược được |

→ **Cả 3 biến thể chính tả đều được nhận diện.** Hệ thống giữ lại **đúng phương thức rẻ nhất**, không phải "miễn phí" như chữ *free* trong tài liệu dễ gây hiểu nhầm — với subtotal < $150 thì phương thức còn lại vẫn tốn **$10**.

### Payment Method — 5 lựa chọn (radio `payment[method]`)

| Nhãn | Giá trị | Ghi chú |
|---|---|---|
| `ending 1111 ( expires : 02/2028 )` | `braintree_cc_vault_5` | **Thẻ đã lưu** trong Braintree vault |
| PayPal / Pay Later | `paypal_express` | |
| Card | `braintree` | Nhập thẻ mới — xem chi tiết ngay dưới |
| Google Pay | `braintree_googlepay` | |
| Amazon Pay | `amazon_payment_v2` | ✅ **Có** — đính chính nhận định lần 1 ("không thấy Amazon Pay"); nó không có ở mini cart nhưng **có** ở checkout |

#### Form nhập thẻ (`Card`) — cách mở và cấu trúc

🔑 **Phải bấm vào cả VÙNG `Card`** (khối `.payment-method-braintree`), **không phải** chỉ tích radio — form thẻ mới render ra. Đây là lý do 2 lần khảo sát trước không nhập được thẻ.

| Thành phần | Chi tiết |
|---|---|
| Logo thẻ chấp nhận | **Visa · Mastercard · AMEX · JCB · Discover** |
| `Credit Card Number` | iframe `braintree-hosted-field-number` |
| `Exp.Date MM/YYYY` | iframe `braintree-hosted-field-expirationDate` — gõ `022028`, tự format thành `02 / 2028` |
| `CVV` | iframe `braintree-hosted-field-cvv`, có icon `?` trợ giúp |

- **Braintree Hosted Fields** `assets.braintreegateway.com/web/3.112.0` — **iframe cross-origin**, KHÔNG set `value` bằng JS được, bắt buộc gõ thật
- Nhập đúng → **viền field chuyển xanh** và **logo đổi sang đúng hãng thẻ** (nhập `4111…` → logo chỉ còn VISA). Đây là tín hiệu tốt để assert trong automation
- Số thẻ tự format nhóm 4: `4111 1111 1111 1111`
- ⚠️ **Field nở ra sau khi nhập số thẻ** làm Exp/CVV **dịch xuống** — automation phải lấy lại toạ độ, không dùng toạ độ đã đo trước đó
- Checkbox lưu thẻ: `vault[is_enabled]` — nhãn **`Save for later use.`** (chỉ khi đã đăng nhập)

#### 🚨 Popup Klaviyo bật giữa luồng thanh toán (`AMB-11`)

Trong lúc đang nhập thẻ, một popup Klaviyo **thứ hai** tự bật lên che kín vùng form:

```
[ảnh sản phẩm]   Where should we send it?  [input email]
                 [ GET DISCOUNT NOW ]                    [×]
```

Hệ quả quan sát trực tiếp: **ký tự đang gõ rơi vào ô email của popup**, không vào field thẻ — và **không có thông báo lỗi nào**. Phải bấm `×` rồi nhập lại từ đầu.

Đây là popup **khác** với "Spin to Win" ở trang chủ/đăng nhập (`AMB-02`). Rủi ro nghiệp vụ thật: popup marketing chen vào đúng bước nhạy cảm nhất của luồng mua hàng.
- **Không thấy Afterpay** trong danh sách payment ở checkout (dù Afterpay có nạp ở mini cart)
- **Không thấy Apple Pay** — hợp lý vì chỉ khả dụng trên Safari/iOS

### Giảm giá — 4 cơ chế độc lập

| Cơ chế | Field / UI | Extension |
|---|---|---|
| Mã khuyến mãi | `mpmultiplecoupons_code`, placeholder `Enter Promo Code` + `Apply` | **Mageplaza Multiple Coupons** — khớp tài liệu "Multiple Coupons Extensions" |
| Gift card | `giftcard_code`, placeholder `Enter Gift Card Code` + `Apply` + **`See Balance`** | |
| Store Credit | `customer-balance-checkbox` — hiển thị `You currently have no money in store credit!` khi số dư 0 | |
| Điểm thưởng | Tiêu đề **`YOU HAVE 11319 POINTS`** + dropdown `Choose reward` + `APPLY` / `Use reward points` | Yotpo |

### Summary

```
Subtotal              $259.90
Shipping and Handling $0.00   (Free Economy Shipping on Orders Over $150)
Tax                   $0.00   (địa chỉ Kansas, US)
Grand Total           $259.90
```

Item hiển thị: ảnh · tên `KAYLA` · `Brandy Leopard | 38` · giá · **ô chỉnh qty có nút `−` / `+`** ngay tại checkout.

---

## Guest checkout — đã khảo sát (2026-09-11)

Truy cập `/onestepcheckout/` khi **chưa đăng nhập**. Khác vai Customer ở các điểm:

| Khác biệt | Guest | Customer |
|---|---|---|
| Link đăng nhập nhanh | ✅ Có khối **`Sign in`** (`username` + `password` placeholder `optional`) | — |
| **Email Address** | ✅ Bắt buộc (`username`) | Không hỏi |
| Địa chỉ | Nhập tay toàn bộ, **không** có thẻ địa chỉ đã lưu | Chọn từ thẻ địa chỉ đã lưu |
| **`Join the newsletter and keep in touch`** | ✅ `osc-newsletter` | Không thấy |
| **`Create account`** | ✅ `create-account-checkbox` + `password` + `password_confirmation` | — |
| **Store Credit** | ❌ Khoá — hiện `To use store credit, please Login` | ✅ Dùng được |
| Điểm thưởng | ❌ Không có khối điểm | ✅ `YOU HAVE <N> POINTS` |
| Payment methods | **4**: `paypal_express` · `braintree` · `braintree_googlepay` · `amazon_payment_v2` | **5** (thêm thẻ đã lưu `braintree_cc_vault_*`) |

✅ Xác nhận tài liệu: *"Guest Checkout — không có store credit và point reward"* và *"Create Account sau khi checkout thành công"* đều **có thật**.

---

## Mã giảm giá & Gift Card — đã áp thật (2026-09-11)

Test trên đơn Guest: 1 × Kayla `$129.95`, ship Economy `$10.00`, địa chỉ New York NY 10022.

### Coupon `CBITESTMM`

| | |
|---|---|
| Field | `mpmultiplecoupons_code` (Mageplaza Multiple Coupons), placeholder `Enter Promo Code` |
| Kết quả | ✅ Thành công |
| Message nguyên văn | **`Apply discount code successfully.`** |
| UI sau khi áp | Hiện chip **`X CBITESTMM`** — nút `X` để gỡ |
| Dòng trong Summary | `CBITESTMM    -$10.00` |
| Giá trị giảm | **$10.00** |

### Gift Card `L854RRLPLJJX`

| | |
|---|---|
| Field | `giftcard_code`, placeholder `Enter Gift Card Code` |
| Kết quả | ✅ Thành công |
| Message nguyên văn | **`Gift Card L854RRLPLJJX was added.`** |
| Dòng trong Summary | `Remove Gift Cards (L854RRLPLJJX)    -$25.00` — có link gỡ ngay trên dòng |
| Giá trị | **$25.00** |
| UI sau khi áp | Xuất hiện nút **`See Balance`** |

### ✅ Cộng dồn được — xác nhận công thức Grand Total

```
Subtotal                        $129.95
Gift Cards (L854RRLPLJJX)       -$25.00
Shipping (Economy < $150)        $10.00
CBITESTMM                       -$10.00
Tax                              $0.00
────────────────────────────────────────
Grand Total                     $104.95
```

`129.95 − 25 + 10 − 10 + 0 = 104.95` ✅

→ Khớp chính xác công thức tài liệu: **`Grand Total = (Subtotal + shipping fee + tax) − Discount (coupon, gift card, store credit)`**

→ Cũng xác nhận **coupon và gift card dùng đồng thời được**, và cả hai đều áp được **ở vai Guest**.

---

### Đặt hàng thành công — vai **GUEST** (nhập thẻ tay)

| | |
|---|---|
| Vai | **Guest** (chưa đăng nhập) |
| Địa chỉ | `300 park ave, New York, New York, 10022, US` — qua popup Address Validation, bấm `Confirm` |
| Giảm giá | Coupon `CBITESTMM` (−$10) **+** Gift Card `L854RRLPLJJX` (−$25) |
| Phương thức | **`Card`** — nhập tay thẻ test Visa vào Braintree Hosted Fields |
| Grand Total | `$104.95` |
| Kết quả | ✅ **Thành công** |
| Trang đích | `/checkout/onepage/success/` |

**Nội dung trang Thank you của GUEST — khác vai Customer:**

```
Thank you for your purchase!
Your order # is: <số>.                            ← Customer ghi "Your order number is:"
We'll email you an order confirmation with details and tracking info.
You could have earned 119 points for this order   ← "could have" — GUEST KHÔNG ĐƯỢC ĐIỂM
Create an account now to claim your rewards and earn an extra 50 points!
[ Create an Account ]
Share your new shoes!
```

→ ✅ Xác nhận tài liệu: **Guest không nhận point reward**. Hệ thống chỉ *nhắc* số điểm lẽ ra nhận được và mời tạo tài khoản (kèm ưu đãi **+50 điểm**).

### Đặt hàng thành công — vai **CUSTOMER** (thẻ đã lưu)

| | |
|---|---|
| Phương thức | Thẻ đã lưu `ending 1111, expires 02/2028` (chính là thẻ test Visa) |
| Kết quả | ✅ Thành công |
| Trang đích | `/checkout/onepage/success/` · title `Success Page` · h1 **`Thank you for your purchase!`** |
| Số đơn | Có hiển thị dạng `Your order number is: <số>.` |
| Nội dung khác | `We'll email you an order confirmation with details and tracking info.` · **`You earned 259 points for this order`** · link `View your rewards` · khối `Share your new shoes!` |
| Giỏ hàng sau khi đặt | Về **0** |

---

## ⭐ Công thức điểm thưởng — xác định chính xác bằng 2 đơn hàng

| Đơn | Subtotal | Coupon | Gift Card | Shipping | Grand Total | Điểm |
|---|---|---|---|---|---|---|
| Customer | `$259.90` | — | — | `$0.00` | `$259.90` | **259** |
| Guest | `$129.95` | `−$10.00` | `−$25.00` | `$10.00` | `$104.95` | **119** |

**Suy ra:**

```
point = floor( Subtotal − Discount_coupon )
```

| Kiểm chứng | |
|---|---|
| Đơn Customer | `floor(259.90 − 0)` = **259** ✅ |
| Đơn Guest | `floor(129.95 − 10.00)` = `floor(119.95)` = **119** ✅ |

**Ba điều rút ra — không có trong tài liệu:**

1. **Gift card KHÔNG trừ vào cơ sở tính điểm** — nó là *phương tiện thanh toán*, không phải giảm giá. Nếu trừ thì đơn Guest chỉ ra 94 điểm
2. **Shipping KHÔNG cộng vào cơ sở tính điểm** — nếu cộng thì ra 129 điểm
3. **Không tính trên Grand Total** — nếu vậy đơn Guest ra 104 điểm

→ Phần `(Subtotal − Discount)` của tài liệu **ĐÚNG**. Chỉ **hệ số `× 5` là SAI** — thực tế là **× 1**.

`AMB-04` **đã đóng** — lấy UI làm chuẩn, và bổ sung 3 làm rõ ở trên vào tài liệu requirements khi recon module `REWARD`.

---

## Vùng chưa xác minh — riêng module này

| Vùng | Ghi chú |
|---|---|
| Thanh toán bằng **PayPal** · **Google Pay** · **Amazon Pay** | Chưa thử — đều cần tài khoản bên thứ ba |
| **Apple Pay** · **After Pay** | Không xuất hiện trong danh sách Payment Method. Apple Pay cần thiết bị Apple; After Pay cần xác nhận với dev |
| **`GO BACK`** ở popup Address Validation | Mới thử nhánh `Confirm` |
| Popup Address Validation khi **nhập zip sai** | Mới thử với địa chỉ đúng (2 lựa chọn giống hệt nhau) |
| **Store credit** áp thật | Tài khoản test có số dư $0 (`You currently have no money in store credit!`) |
| **Điểm thưởng** áp thật | Tài khoản có 11319 điểm; mới thấy dropdown `Choose reward`, chưa bấm APPLY |
| **Auto apply coupon** `?k_welcome_code=` | Có tồn tại trên header; chưa xác minh coupon vào tới order |
| **Tax** khác 0 | Cả 3 đơn test đều ra tax `$0.00` — Kansas 66047 **và** New York NY 10022. QA đã xác nhận **để kiểm tra sau** (`AMB-08`, hạ xuống 🟡) |
| **Tạo account từ trang Thank you** | Guest thấy nút `Create an Account` + ưu đãi `+50 points`; chưa bấm thử |
| **Địa chỉ ngoài US** | Chưa thử — tài liệu nêu UPS i-parcel cho Canada/quốc tế |
| **Validation địa chỉ** | Chưa nhập địa chỉ sai để trigger message |
| **Tạo account sau checkout** (`create-account-checkbox`) | Chưa thử |
| **Đa tiền tệ khi thanh toán** | Chưa thử ở store view khác USD |
| Nhấn vào **order ID** ở trang Thank you để sang order detail | Chưa thử |

---

## 🎓 Bài học — vì sao lần 1 khảo sát sai

| Sai ở đâu | Hệ quả | Cách đúng |
|---|---|---|
| **Đoán route** `/checkout/` theo mặc định Magento thay vì bấm nút thật | Kết luận sai "Fastly chặn checkout", đánh dấu nhầm 2 module là BLOCKED, bỏ sót toàn bộ nội dung trang | Luôn **đi từ UI**: add to cart → mở side cart → bấm `Checkout` |
| Đọc `href` để tìm route | Nút `Checkout` là `<button>` **không có href** → không tìm ra bằng cách đọc link | Khi phần tử không có `href`, **phải bấm** rồi đọc URL đích |
| Suy rộng từ 1 path sang cả nhánh | Thấy `/checkout/` 403 rồi kết luận cả `/checkout/*` bị chặn. Thực tế `/checkout/onepage/success/` **vào được** | Chỉ kết luận đúng phạm vi đã thử |

Quy tắc chống lặp lại đã bổ sung vào `/discover-system` (Bước 3.1a).

## Trạng thái `/checkout/cart/` và `/checkout/`

| Route | Kết quả | Ý nghĩa |
|---|---|---|
| `/onestepcheckout/` | ✅ 200 | **Trang checkout thật** |
| `/checkout/onepage/success/` | ✅ 200 (qua redirect sau khi đặt hàng) | Trang Thank you |
| `/checkout/cart/` | ✅ **Hoạt động bình thường** (QA xác nhận bằng ảnh). Agent gặp 403 do **vị trí mạng của máy khảo sát**, không phải lỗi hệ thống | Trang giỏ hàng — xem [`module_03`](module_03_gio_hang.md) |
| `/checkout/` | ❌ 403 từ máy khảo sát | **Không phải route của site** — không ảnh hưởng nghiệp vụ |

## Evidence

❌ Chưa lưu được ảnh xuống đĩa — xem lý do ở mục 7 của [`system_map.md`](../system_map.md).
