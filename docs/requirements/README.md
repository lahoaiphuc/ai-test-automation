# DANH MỤC REQUIREMENTS — Miz Mooz (storefront)

> **Điểm vào cấp hệ thống.** Đọc file này ĐẦU TIÊN ở mọi phiên làm việc đụng `docs/`.
> Bản đồ hệ thống: [`_discovery/system_map.md`](_discovery/system_map.md)

| | |
|---|---|
| Hệ thống | **Miz Mooz** — storefront thương mại điện tử, Magento 2 (Magento Cloud) |
| Tiền tố TC ID | **`MM_`** — dạng `MM_<MODULE>_TC_<3 số>`, ví dụ `MM_PDP_TC_001` |
| Môi trường | Staging riêng, **KHÔNG dùng chung** → được phép tạo/sửa dữ liệu test |
| URL · tài khoản | Lưu ở `.env` — **KHÔNG** ghi vào `docs/` |
| Lần khám phá gần nhất | 2026-09-11 · mode **HYBRID** |

---

## 1. Bảng danh mục module

17 module. Prefix đã cấp là **vĩnh viễn** — module mới phải chọn prefix chưa có trong bảng.

| Module | Prefix | Trạng thái recon | Mức phủ tài liệu | Tài liệu | REQ đã dùng | Mã kế tiếp | AMB treo | Cập nhật |
|---|---|---|---|---|---|---|---|---|
| Chi tiết sản phẩm | `PDP` | ⬜ Chưa khảo sát | 🟩 Đầy đủ | — | — | `REQ-PDP-01` | — | 2026-09-11 |
| Danh sách sản phẩm | `PLP` | ⬜ Chưa khảo sát | 🟩 Đầy đủ | — | — | `REQ-PLP-01` | — | 2026-09-11 |
| Tìm kiếm | `SEARCH` | ⬜ Chưa khảo sát | 🟩 Đầy đủ | — | — | `REQ-SEARCH-01` | — | 2026-09-11 |
| Giỏ hàng & Mini cart | `CART` | 🟨 Đang khảo sát | 🟩 Đầy đủ | — | — | `REQ-CART-01` | AMB-07 | 2026-09-11 |
| Thanh toán | `CHECKOUT` | 🟨 Đang khảo sát | 🟩 Đầy đủ | — | — | `REQ-CHECKOUT-01` | AMB-08, AMB-10, AMB-11 | 2026-09-11 |
| Đăng nhập·Đăng ký·Quên MK | `AUTH` | ⬜ Chưa khảo sát | 🟩 Đầy đủ | — | — | `REQ-AUTH-01` | AMB-02, AMB-03 | 2026-09-11 |
| Tài khoản khách hàng | `ACCOUNT` | ⬜ Chưa khảo sát | 🟩 Đầy đủ | — | — | `REQ-ACCOUNT-01` | — | 2026-09-11 |
| Wishlist | `WISH` | ⬜ Chưa khảo sát | 🟨 Một phần | — | — | `REQ-WISH-01` | — | 2026-09-11 |
| Điểm thưởng (Yotpo) | `REWARD` | ⬜ Chưa khảo sát | 🟨 Một phần | — | — | `REQ-REWARD-01` | — | 2026-09-11 |
| Gift Card | `GIFT` | ⬜ Chưa khảo sát | 🟨 Một phần | — | — | `REQ-GIFT-01` | — | 2026-09-11 |
| Trả hàng (RMA) | `RMA` | ⬜ Chưa khảo sát | 🟨 Một phần | — | — | `REQ-RMA-01` | — | 2026-09-11 |
| Multi-store & Đa tiền tệ | `STORE` | ⬜ Chưa khảo sát | 🟩 Đầy đủ | — | — | `REQ-STORE-01` | — | 2026-09-11 |
| Điều hướng (Header·Footer·Menu) | `NAV` | ⬜ Chưa khảo sát | 🟩 Đầy đủ | — | — | `REQ-NAV-01` | AMB-05 | 2026-09-11 |
| Trang chủ | `HOME` | ⬜ Chưa khảo sát | 🟩 Đầy đủ | — | — | `REQ-HOME-01` | AMB-06 | 2026-09-11 |
| Nội dung tĩnh & Liên hệ | `CMS` | ⬜ Chưa khảo sát | 🟨 Một phần | — | — | `REQ-CMS-01` | — | 2026-09-11 |
| Newsletter (Klaviyo) | `NEWS` | ⬜ Chưa khảo sát | 🟩 Đầy đủ | — | — | `REQ-NEWS-01` | — | 2026-09-11 |
| Email giao dịch | `EMAIL` | ⬜ Chưa khảo sát | 🟩 Đầy đủ | — | — | `REQ-EMAIL-01` | — | 2026-09-11 |

**Prefix đã chiếm:** `PDP` `PLP` `SEARCH` `CART` `CHECKOUT` `AUTH` `ACCOUNT` `WISH` `REWARD` `GIFT` `RMA` `STORE` `NAV` `HOME` `CMS` `NEWS` `EMAIL`

**Bảng mã trạng thái recon:** ⬜ Chưa khảo sát · 🟨 Đang khảo sát · ✅ Đã có tài liệu · ⏸️ Hoãn · ⚪ Chưa implement

---

## 2. Trạng thái REQ toàn hệ thống

Chưa có REQ nào — tầng khám phá **không cấp số REQ** (chỉ cấp prefix). Số REQ sinh ra khi chạy `/generate-requirements-from-website` cho từng module.

---

## 3. Ambiguity 🔴 High còn treo

| Mã | Nội dung | Module liên quan | Chặn gì |
|---|---|---|---|
| ~~`AMB-01`~~ | ✅ **ĐÃ ĐÓNG (2026-09-11) — KHÔNG PHẢI LỖI HỆ THỐNG.** QA cung cấp ảnh chứng minh `/checkout/cart/` mở bình thường. 403 chỉ xảy ra **với vị trí mạng của máy chạy agent** (node CDN châu Á HKG·SIN·NRT). Đây là **giới hạn môi trường khảo sát**, đã ghi vào mục 7 của `system_map.md`. **KHÔNG** sinh test case theo hướng "hệ thống chặn giỏ hàng" | `CART` | — |
| `AMB-02` | 🔴 Popup Klaviyo "Spin to Win" che form đăng nhập/đăng ký khi mới vào trang → chặn tương tác. Cần hỏi: popup có điều kiện hiển thị gì (lần đầu? theo cookie? theo store view?) và có tắt được trên staging không | `AUTH` `HOME` `NEWS` | Mọi automation phải xử lý popup trước; chưa rõ rule hiển thị |
| `AMB-03` | 🔴 Tài liệu yêu cầu **captcha bắt buộc** ở form Sign Up và Forgot Password, nhưng DOM form `/customer/account/create/` không có element captcha. Tài liệu cũng nêu checkbox "Show Password" — không thấy trong DOM | `AUTH` | Chưa rõ captcha bị tắt trên staging hay chưa implement |
| ~~`AMB-04`~~ | ✅ **ĐÃ ĐÓNG (2026-09-11).** Công thức điểm thưởng: đơn hàng thật `$259.90` → nhận **`259 points`** ⇒ tỉ lệ **1 điểm / $1**, khớp trang `/rewards`. **Tài liệu sai** khi ghi `(Subtotal − Discount) × 5`. Lấy UI làm chuẩn | `REWARD` `CHECKOUT` | — |
| `AMB-05` | 🔴 Tài liệu mô tả menu có **Blog** và Best Sellers hiển thị **22 sp/page**; UI thực tế `/blog` trả 404, menu không có Blog, Best Sellers hiển thị **18 sp/page**. Sort By cũng thiếu option `bestseller` | `NAV` `PLP` | Chưa rõ đã gỡ tính năng hay staging chưa cấu hình |
| `AMB-06` | 🟡 Trang chủ hiển thị nhiều chỗ `File is not exist on server.` — media lỗi trên staging | `HOME` | Chưa rõ là lỗi dữ liệu staging hay lỗi thật |
| `AMB-07` | 🟡 Tài liệu yêu cầu mini cart **tự bung vài giây rồi đóng** sau khi add to cart. Thực tế side cart **không tự bung**, phải bấm icon giỏ | `CART` `PDP` | Cần xác nhận đây là thay đổi có chủ đích hay lỗi |
| `AMB-08` | 🟡 **Tax luôn bằng `$0.00`** trên cả 3 đơn test: Kansas 66047 và **New York NY 10022** (bang có thuế bán hàng). Tài liệu yêu cầu *"tính tax chính xác theo rate của TaxJar"* | `CHECKOUT` | Nghi TaxJar chưa cấu hình trên staging. **QA đã chốt: kiểm tra sau** — hạ mức ưu tiên |
| ~~`AMB-09`~~ | ✅ **ĐÃ ĐÓNG (2026-09-11)** — QA chốt lấy thực tế làm chuẩn. Bản đồ Express Checkout & Payment ở 4 vị trí đã ghi đầy đủ trong [`module_04`](_discovery/modules/module_04_thanh_toan.md). Tóm tắt: **trang Cart** PayPal·Pay Later · **Side Cart** + G Pay · **Express Checkout** + G Pay · **Payment Method** Card·PayPal/Pay Later·Google Pay·Amazon Pay (+thẻ vault khi đăng nhập). **Apple Pay** và **After Pay** không xuất hiện | `CART` `CHECKOUT` | — |
| `AMB-10` | 🟡 Popup **Address Validation** vẫn bật khi địa chỉ đã chuẩn, và 2 lựa chọn `original` / `suggested` **giống hệt nhau từng ký tự**. Ma sát thừa trong luồng thanh toán | `CHECKOUT` | Cần chốt: có nên bỏ qua popup khi 2 địa chỉ trùng nhau? |
| `AMB-11` | 🔴 **Popup Klaviyo bật giữa lúc nhập thẻ** ở `/onestepcheckout/` (`Where should we send it?` / `GET DISCOUNT NOW`), che kín form thẻ. Ký tự đang gõ **rơi vào ô email của popup**, không có thông báo lỗi nào | `CHECKOUT` `NEWS` | Rủi ro thật với khách hàng đang thanh toán. Cần chốt điều kiện hiển thị popup, và tắt popup ở trang checkout |

Chi tiết đối chiếu tài liệu ↔ UI: [`_discovery/doc_inventory.md`](_discovery/doc_inventory.md)

---

## 4. Cấu trúc thư mục chuẩn

```
docs/requirements/
├── README.md                              ← file này
├── _discovery/
│   ├── system_map.md                      ← INDEX bản đồ hệ thống (tên bất biến)
│   ├── modules/module_NN_<slug>.md        ← 11 file, 17 module
│   ├── doc_inventory.md                   ← bản đồ phủ tài liệu + bảng lệch pha
│   ├── sources/                           ← bản gốc tài liệu QA cung cấp
│   └── evidence/                          ← ảnh tổng quan mỗi module
└── <module>/
    ├── requirements_<module>.md           ← INDEX cấp module (tên bất biến)
    ├── evidence/*.png
    ├── analysis/analysis_<TICKET-ID>.md
    └── impact/impact_<TICKET-ID>.md
```

---

## 5. Quy trình sử dụng

| Tình huống | Workflow | Ghi vào đâu |
|---|---|---|
| Khảo sát chi tiết 1 module | `/generate-requirements-from-website <module>` | `docs/requirements/<module>/requirements_<module>.md` + cập nhật cột `Trạng thái recon` ở bảng mục 1 |
| Có ticket đổi yêu cầu | `/update-requirements-from-ticket` | `<module>/impact/impact_<TICKET-ID>.md` |
| Sinh test case | `/generate-testcases-manual-rbt` hoặc `/generate-testcases-from-requirements` | `docs/testcases/<module>/test_cases_<module>.md` |
| Phát hiện module mới | `/discover-system` (Mode ADD) | Thêm dòng ở mục 1 + Nhật ký khám phá của `system_map.md` |

---

## 6. Nhật ký danh mục

| Ngày | Thay đổi | Ghi chú |
|---|---|---|
| 2026-09-11 | Khởi tạo danh mục, cấp prefix cho 17 module | Mode HYBRID · chốt tiền tố TC ID `MM_` · chốt môi trường KHÔNG dùng chung · user xác nhận danh sách module đã đủ |
| 2026-09-11 | **Vòng 4 — đặt đơn GUEST thành công bằng thẻ nhập tay.** Mở form thẻ đúng cách (**bấm cả vùng `Card`**, không chỉ tích radio), nhập thẻ test vào Braintree Hosted Fields, áp coupon + gift card, đặt đơn `$104.95` thành công. Phát hiện **popup Address Validation** (có thật, khớp tài liệu) và **popup Klaviyo bật giữa lúc nhập thẻ** (`AMB-11` 🔴). Xác định **công thức điểm chính xác** `floor(Subtotal − Discount_coupon)` bằng 2 đơn hàng — gift card và shipping đều không tính vào. Xác nhận **Guest không được điểm**. **Đóng `AMB-09`** (đã lập bản đồ Express Checkout 4 vị trí), hạ `AMB-08` xuống 🟡 theo chỉ đạo QA. Mở `AMB-10`, `AMB-11` | Claude Code · Chrome thật |
| 2026-09-11 | **Khảo sát vòng 3: Guest checkout + coupon + gift card + PO Box.** Áp thật `CBITESTMM` (−$10) và gift card `L854RRLPLJJX` (−$25) ở vai Guest — cộng dồn được, xác nhận công thức Grand Total. Kiểm chứng **quy tắc PO Box** với cả 3 biến thể chính tả: 4 phương thức ship rút còn 1, đảo ngược được. Đo bảng giá ship ở **cả 2 ngưỡng** subtotal ⇒ bảng giá tài liệu **đúng 100%**. **Đóng `AMB-01`** — trang giỏ hàng KHÔNG bị lỗi, 403 là giới hạn mạng phía agent (QA cung cấp ảnh chứng minh). Mở `AMB-08` (tax luôn $0) và `AMB-09` (express checkout lệch nhau giữa 3 nơi) | Claude Code |
| 2026-09-11 | **Khảo sát lại CART + CHECKOUT theo đường đi thật của người dùng.** Phát hiện route checkout thật là `/onestepcheckout/` (lần 1 đoán nhầm `/checkout/`). Đặt đơn hàng thật thành công → **đóng `AMB-04`**, **thu hẹp `AMB-01`** xuống chỉ còn trang giỏ hàng, mở `AMB-07`. `CART` và `CHECKOUT` chuyển sang 🟨 Đang khảo sát | Prefix **không đổi** |
