# Module 02 — Danh sách sản phẩm (PLP) · Tìm kiếm (SEARCH)

← Quay lại [`system_map.md`](../system_map.md) · Trạng thái recon tra ở [`README.md`](../../README.md)

> Hai module chung file vì dùng **chung bộ công cụ toolbar** (filter · sort · limiter · phân trang). Ranh giới truy vết vẫn là **2 prefix riêng**, và sẽ sinh ra **2 file** `requirements_plp.md` + `requirements_search.md`.

---

## 2.1 — Danh sách sản phẩm

| | |
|---|---|
| Prefix | `PLP` |
| Bí danh trong tài liệu | "Product Listing" |
| Route | `/shop` · `/shop/women-boots` · `/best-sellers` · `/clearance` · `/verbenas` · `/new-noteworthy` … (19 category quan sát được ở cây menu) |
| Loại màn hình | Danh sách + bộ lọc |
| CRUD | Chỉ đọc + hành động: Add to Wish List · chọn color trên thumbnail |
| Risk | 🟡 Trung bình |
| Ước REQ | 25–35 |

### Đã kiểm chứng (2026-09-11)

| Hạng mục | Quan sát được |
|---|---|
| Bộ lọc | **Type · Size · Color · Price** (trang category). Trang Search chỉ có **Type · Size · Color** — không có Price |
| Sort By | `Newest` · `Price: Low to High` · `Price: High to Low` |
| Limiter | `Show 18 per page` · `Show 36 per page` · `Show All` |
| Số sp/trang | **18** — `/shop/women-boots` hiển thị `Items 1-18 of 56` |
| Phân trang | 1 · 2 · 3 · 4 · Next |
| Breadcrumb | `Home > Shop > Boots` |
| Flag | Quan sát được nhãn `BEST SELLER` trên sản phẩm |

### ⚠️ Lệch pha với tài liệu

| Tài liệu | UI thực tế | Mã |
|---|---|---|
| Best Sellers hiển thị **22 sp/page** (trang đầu) | `/best-sellers` → `Items 1-18 of 57` → **18 sp/page** | `AMB-05` |
| Sort By có option **bestseller**, và là **mặc định** | Không có option bestseller. Chỉ có Newest / Price × 2 | `AMB-05` |

### Vùng chưa xác minh — riêng PLP

- Hành vi filter theo **color group** và quy tắc "filter màu nào thì thumbnail đổi sang màu đó"
- Quy tắc **ẩn bớt màu bằng dấu `+`** khi sản phẩm có > 4 color
- **Hover đổi ảnh**
- Hiển thị **giá dạng `From $50 - $100`** khi các simple có special price khác nhau
- Quy tắc "sản phẩm out of stock **không** hiển thị ở category"

---

## 2.2 — Tìm kiếm

| | |
|---|---|
| Prefix | `SEARCH` |
| Bí danh trong tài liệu | "Search" |
| Route | `/catalogsearch/result/?q=<keyword>` → **rewrite thành `/search/<keyword>`** · `/catalogsearch/advanced/` |
| Loại màn hình | Danh sách kết quả |
| Risk | 🟡 Trung bình |
| Ước REQ | 10–15 |

### Đã kiểm chứng (2026-09-11)

| Hạng mục | Quan sát được |
|---|---|
| Form | `#search_mini_form`, action `/catalogsearch/result/`, field `q` |
| URL kết quả | Gõ `?q=boots` → URL cuối là `/search/boots` (có URL rewrite) |
| Kết quả | `Items 1-18 of 48` cho từ khoá `boots` — cùng toolbar với PLP |
| Bộ lọc | Type · Size · Color (**không có Price** như trang category) |
| Advanced Search | Tồn tại tại `/catalogsearch/advanced/` — **tài liệu không nhắc tới** |

### Vùng chưa xác minh — riêng SEARCH

- **Danh sách gợi ý (suggestion)** khi đang gõ — tài liệu yêu cầu hiển thị image, giá gốc, rating, giá sale
- Search bằng **brand name** và **category name** (tài liệu nêu; mới thử product keyword)
- Quy tắc **xếp sản phẩm phù hợp nhất lên đầu**
- Màn hình **không có kết quả**

## Evidence

❌ Chưa có ảnh — xem lý do ở mục 7 của [`system_map.md`](../system_map.md).
