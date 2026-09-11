# Module 06 — Điểm thưởng (REWARD)

← Quay lại [`system_map.md`](../system_map.md) · Trạng thái recon tra ở [`README.md`](../../README.md)

| | |
|---|---|
| Prefix | `REWARD` |
| Bí danh trong tài liệu | "Rewards Program" · "Point reward management" · "Apply Point Reward" |
| Route | `/rewards` (trang giới thiệu, công khai) · `/rewards-program/dashboard/` (cần đăng nhập) |
| Loại màn hình | Landing + Dashboard |
| Nền tảng | **Yotpo Loyalty** (`cdn-widgetsrepository.yotpo.com`, `api-cdn.yotpo.com`) |
| Risk | 🔴 Cao — điểm quy đổi thành tiền giảm giá |
| Ước REQ | 12–18 |

## Đã kiểm chứng (2026-09-11)

Trang `/rewards` nêu nguyên văn:

- `Create an account and get 50 points.`
- `Earn points every time you shop. $1.00 spent = 1 point earned!`
- `*Points can only be earned when shopping in USD`
- Có nút `JOIN NOW` và `LOGIN`
- Cơ chế: SIGN UP → EARN POINTS → REDEEM POINTS

## ✅ Công thức tính điểm — ĐÃ XÁC ĐỊNH bằng 2 đơn hàng thật

```
point = floor( Subtotal − Discount_coupon )
```

| Đơn | Subtotal | Coupon | Gift Card | Shipping | Grand Total | Điểm thực nhận |
|---|---|---|---|---|---|---|
| Customer | `$259.90` | — | — | `$0.00` | `$259.90` | **259** |
| Guest | `$129.95` | `−$10.00` | `−$25.00` | `$10.00` | `$104.95` | **119** *(chỉ là "could have")* |

**Ba làm rõ không có trong tài liệu — phải thành REQ riêng khi recon module này:**

| # | Quy tắc | Bằng chứng |
|---|---|---|
| 1 | **Gift card KHÔNG trừ** vào cơ sở tính điểm (là phương tiện thanh toán, không phải giảm giá) | Nếu trừ thì đơn Guest ra 94 điểm, thực tế 119 |
| 2 | **Shipping KHÔNG cộng** vào cơ sở tính điểm | Nếu cộng thì ra 129 điểm |
| 3 | **Không tính trên Grand Total** | Grand Total $104.95 → sẽ ra 104 điểm, thực tế 119 |

→ Phần `(Subtotal − Discount)` của tài liệu **ĐÚNG**; chỉ **hệ số `× 5` là SAI**, thực tế **× 1**. `AMB-04` đã đóng.

## Guest KHÔNG được tích điểm — đã xác nhận

Trang Thank you của đơn Guest ghi nguyên văn:

> `You could have earned 119 points for this order`
> `Create an account now to claim your rewards and earn an extra 50 points!` + nút `Create an Account`

→ ✅ Khớp tài liệu (*"Guest Checkout — không có store credit và point reward"*), và bổ sung: hệ thống **mời tạo tài khoản ngay tại trang Thank you** kèm ưu đãi **+50 điểm**.

## Ràng buộc tài liệu KHÔNG nhắc

Trang `/rewards` ghi: **`*Points can only be earned when shopping in USD`** — điểm **chỉ tích luỹ ở store view `mm_usd`**. Ràng buộc này cắt ngang module `STORE` (5 store view còn lại đều không phải USD) và cần thành REQ riêng ở cả hai module.

## Vùng chưa xác minh — riêng module này

- Dashboard `/rewards-program/dashboard/` — chưa mở
- Cơ chế **apply point ở checkout** (tài liệu: apply point sinh ra coupon code tự động) — đã thấy dropdown `Choose reward` + `APPLY` ở vai Customer (`YOU HAVE 11319 POINTS`), chưa bấm thử
- **Hệ thống tier** (tài liệu nêu "tiers system")
- **Referral program** — tạo link giới thiệu kèm coupon
- Điểm cộng vào tài khoản sau bao lâu (trang Thank you báo ngay, chưa kiểm dashboard)
- Điểm cộng cho hành vi ngoài mua hàng (viết review, follow mạng xã hội)

## Evidence

❌ Chưa có ảnh — xem lý do ở mục 7 của [`system_map.md`](../system_map.md).
