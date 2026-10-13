# Hướng thiết kế & UX

> Chốt ngày 2026-10-13. Hai bề mặt, một bộ token. Mọi component mới phải theo file này; muốn đổi thì sửa file này trước.
> Wireframe Figma: https://www.figma.com/design/rInWFVz102PhXf2LV9kQK4 (trang Foundations = token + component; Mobile, Desktop, Admin CMS = các màn chính).

| | Hướng 1: Admin CMS | Hướng 2: Ứng dụng người dùng |
|---|---|---|
| Đường dẫn | `/admin/*` | Mọi trang còn lại |
| Người dùng | 4 admin trong nhóm, dùng laptop | Thành viên, chủ yếu dùng điện thoại |
| Ưu tiên | Xử lý nhanh, nhiều dữ liệu trên một màn | Ảnh sản phẩm, giá, độ tin cậy, thao tác bằng ngón cái |
| Render | Client-only, Ant Design 6 | Trang công khai SSR bằng CSS thuần + token; trang cần đăng nhập dùng Ant Design |
| Thư mục | `frontend/src/admin/` | `frontend/src/components/`, `pages/`, `app/` |

## 1. Token dùng chung

Nguồn duy nhất: `frontend/src/styles/tokens.css`. Ant Design đọc lại cùng giá trị ở `frontend/src/theme.ts`; đổi một bên thì đổi cả hai.

| Nhóm | Giá trị |
|---|---|
| Màu chủ đạo | `--color-primary` `#0041d9` (xanh UIT). Một accent duy nhất cho cả hai hướng |
| Nền điều hướng admin | `--color-nav-bg` `#0b2e6e` (navy) |
| Nền trang | `--color-bg` `#f4f6fa`, bề mặt `#ffffff` |
| Chữ | `#121722` (chính), `#4b5468` (phụ), `#6b7487` (mờ) |
| Ngữ nghĩa | success `#0f7b4b`, warning `#9a5b00`, danger `#c4262e`. Giá tiền dùng danger để nổi bật |
| Font | Be Vietnam Pro 400/500/600/700, hỗ trợ đủ dấu tiếng Việt |
| Bo góc | Input, nút: 8px. Card, ảnh: 12px. Chip, huy hiệu: tròn hẳn. Không trộn kiểu khác |
| Khoảng cách | Bước 4px (`--space-1` … `--space-8`) |
| Icon | Chỉ dùng `@phosphor-icons/react` (đã cài), một độ đậm. Không vẽ SVG tay, không dùng emoji |

Chế độ tối: **chưa làm trong MVP**. Mọi màu phải đi qua token để sau này thêm `[data-theme="dark"]` mà không phải sửa component.

## 2. Hướng 1: Admin CMS

Phong cách CMS nội bộ quen thuộc của nhóm: điều hướng navy, mỗi trang là một Card, chi tiết mở trong Drawer. Dựng lại hoàn toàn bằng Ant Design, không dùng code hay tài sản của dự án khác.

### Khung (`admin/AdminLayout.tsx`)

- **Header** cao 56px, nền navy. Bên trái: logo SwapInUni (trắng) và nút thu gọn sidebar. Bên phải: chuông thông báo, avatar kèm dropdown (tên, Về trang người dùng, Đăng xuất).
- **Sidebar** rộng 220px, thu gọn còn 72px, nền navy, menu `inline`, tối đa 1 cấp con. Mục đang chọn: nền trắng, chữ `--color-primary`. Hover: `rgba(255,255,255,.08)`.
- **Nội dung** nền `--color-bg`, padding 16px, cuộn độc lập. Không có footer.
- Menu: Tổng quan · Kiểm duyệt · Báo cáo vi phạm · Người dùng · Danh mục · Điểm giao nhận.

### Mẫu trang danh sách (`admin/AdminPage.tsx`)

- Một `Card`: `title` là tên trang; `extra` chứa bộ lọc gọn (ô tìm kiếm, `Select`, `Segmented` trạng thái) và nút chính "+ Thêm" nếu có.
- Bộ lọc nhiều hơn 3 trường thì chuyển xuống một hàng `Form` dạng lưới `repeat(auto-fit, minmax(240px, 1fr))` kèm nút Đặt lại.
- **Trạng thái lọc và phân trang nằm trên URL** (`useSearchParams`), để F5 và Back giữ nguyên. Mặc định 20 dòng mỗi trang.
- `Table`: `bordered`, `size="middle"`, không kẻ sọc. Cột cuối là "Thao tác", `fixed: 'right'`, rộng 120px, chứa nút icon nhỏ có `Tooltip` (Xem, Sửa, Xóa).
- Xóa dùng `Popconfirm`. Thao tác nghiệp vụ (Duyệt, Từ chối, Khóa) dùng `Modal`. Từ chối và khóa **bắt buộc nhập lý do**.
- Xong thì báo bằng `App.useApp().message`. Không thêm thư viện toast.

### Chi tiết (`admin/DetailDrawer.tsx`)

- `Drawer` bên phải rộng 840px (trên mobile là 100%), mở bằng `?id=` trên URL.
- Title gồm mã hoặc tên bản ghi và `StatusTag`. Body: `Descriptions bordered column={1}`, ảnh dùng `Image.PreviewGroup`, nhiều nhóm thông tin thì chia `Tabs`.
- Footer: các nút thao tác căn phải, nút chính nằm cuối.

### Form

- `layout="vertical"`, `Row gutter={24}` hai cột (`Col xs={24} md={12}`), dấu `*` bắt buộc mặc định của antd.
- Form ngắn đặt trong `Modal`, form dài đặt trong `Drawer`. Nút Lưu ở footer.

### Tổng quan (dashboard)

- Hàng ô KPI: `Card` + `Statistic` + icon Phosphor màu primary. Lưới `xs=24 sm=12 lg=6`, gutter 16.
- Số liệu lấy thật từ API (UC26); không dùng số giả.

### Trạng thái → `StatusTag`

| Đối tượng | Trạng thái | Màu `Tag` |
|---|---|---|
| Bài bán | pending Chờ duyệt / approved Đang bán / rejected Bị từ chối / reserved Đang giao dịch / sold Đã bán / hidden Đã ẩn | gold / green / red / blue / default / default |
| Tin cần mua | pending / open Đang tìm / rejected / closed Đã đóng / hidden | gold / green / red / default / default |
| Yêu cầu mua | pending / accepted / rejected / cancelled / completed | gold / blue / red / default / green |
| Báo cáo | open Mới / resolved Đã xử lý / dismissed Bỏ qua | red / green / default |
| Tài khoản | Hoạt động / Bị khóa | green / red |

Một bảng map duy nhất trong `lib/status.ts`, dùng chung cho cả admin và người dùng.

## 3. Hướng 2: Ứng dụng người dùng

**Design read:** chợ mua bán cho sinh viên trên điện thoại, giọng thân thiện và đáng tin, nhìn sạch kiểu marketplace. Dựa trên token SwapInUni, CSS thuần cho SSR và Ant Design cho form.

Thông số định hướng (taste skill): `DESIGN_VARIANCE 4` (lưới đều, dễ quét), `MOTION_INTENSITY 3` (chỉ phản hồi khi chạm), `VISUAL_DENSITY 5` (nhiều sản phẩm nhưng vẫn có khoảng thở).

### Nguyên tắc

1. **Thiết kế cho màn 375px trước**, rồi mở rộng ở 768px và 1024px. Không cuộn ngang. Vùng chạm tối thiểu 44px.
2. **Ảnh là trung tâm.** Thẻ sản phẩm có ảnh tỉ lệ 1:1, `object-fit: cover`, bo 12px. Không đè nhãn lên ảnh, trừ nhãn trạng thái "Đang giao dịch" / "Đã bán" vì đó là thông tin thật.
3. **Giá dễ thấy nhất sau ảnh**, màu danger, đậm, định dạng `150.000 ₫`, giá 0 hiện "Miễn phí".
4. **Tin cậy hiển thị rõ:** `UitBadge` (icon `SealCheck` + "UIT") cạnh tên người bán ở thẻ, trang chi tiết, khung chat. Điểm đánh giá hiện cạnh tên khi có.
5. **Mỗi ý định một nhãn nút**, dùng thống nhất khắp app:

   | Ý định | Nhãn |
   |---|---|
   | Đăng bài | Đăng bán |
   | Liên hệ người bán | Nhắn tin |
   | Gửi yêu cầu mua | Gửi yêu cầu mua |
   | Đăng tin cần mua | Đăng tin cần mua |
   | Đăng nhập | Đăng nhập |

6. **Đủ 4 trạng thái** cho mọi danh sách và màn: đang tải (`Skeleton` đúng hình dạng thẻ), rỗng (nói rõ cần làm gì tiếp và có nút), lỗi (thông báo và nút Thử lại), có dữ liệu.
7. **Chuyển động tiết chế:** thẻ nhấc 2px khi hover, nút thu `scale(.98)` khi nhấn, transition 150ms. Mọi chuyển động tắt khi `prefers-reduced-motion`. Không thêm thư viện animation.
8. **Văn bản:** tiếng Việt, câu ngắn, giọng bình thường. Không dùng dấu gạch dài (—), không emoji, không chữ in hoa toàn bộ để trang trí.

### Khung

- **Header** dính trên cùng: logo, ô tìm kiếm (chiếm phần còn lại), trên desktop thêm nút "Đăng bán" và menu tài khoản.
- **Thanh điều hướng dưới (mobile < 768px)** gồm 5 mục: Trang chủ · Tin cần mua · **Đăng bán** (nút giữa nổi bật) · Tin nhắn · Tài khoản. Có số chưa đọc trên Tin nhắn.
- **Trang chủ:** desktop có bộ lọc dạng sidebar trái; mobile có hàng chip cuộn ngang (danh mục, giá, tình trạng, "Chỉ người bán UIT") và nút "Lọc" mở bottom sheet từ dưới lên (`<dialog>` của trình duyệt, vì trang chủ là SSR không dùng antd).
- **Trang chi tiết:** mobile hiện gallery vuốt ngang, thông tin, rồi thanh hành động dính đáy (giá + "Nhắn tin"). Desktop chia hai cột gallery | thông tin.

### Màn chính

| Màn | Thành phần chính |
|---|---|
| Trang chủ `/` | FilterBar, lưới `ListingCard` (2 cột mobile, 4–5 cột desktop), phân trang |
| Chi tiết `/listings/:id` | `ImageGallery`, `PriceTag`, `ConditionTag`, người bán + `UitBadge` + điểm, mô tả, nút Nhắn tin, nút Báo cáo |
| Đăng bán `/sell` | Form một cột, upload ảnh kéo thả có xem trước, giữ dữ liệu khi lỗi |
| Bài của tôi `/me/listings` | Tab theo trạng thái, thẻ dạng hàng ngang (ảnh nhỏ + trạng thái + thao tác) |
| Tin nhắn `/chat` | Mobile: danh sách và khung chat là 2 màn riêng. Desktop: 2 cột. Thẻ yêu cầu mua nằm trong luồng tin |
| Tin cần mua `/wanted` | Danh sách thẻ chữ (không ảnh), nút Nhắn tin |
| Hồ sơ `/users/:id` | Avatar, `UitBadge`, điểm, số giao dịch, lưới bài đang bán, đánh giá gần đây |

## 4. Danh mục component

| Component | Hướng | File | Dùng ở |
|---|---|---|---|
| `ListingCard` | 2 | `components/ListingCard.tsx` | Trang chủ, hồ sơ, yêu thích |
| `PriceTag` | 2 | `components/PriceTag.tsx` | Thẻ, chi tiết, thẻ yêu cầu mua |
| `ConditionTag` | 2 | `components/ConditionTag.tsx` | Thẻ, chi tiết |
| `UitBadge` | 1 + 2 | `components/UitBadge.tsx` | Thẻ, chi tiết, chat, hồ sơ, bảng người dùng admin |
| `StatusTag` | 1 + 2 | `components/StatusTag.tsx` + `lib/status.ts` | Bài của tôi, admin |
| `EmptyState`, `ErrorState`, `ListingCardSkeleton` | 2 | `components/States.tsx` | Mọi danh sách |
| `ImageGallery` | 2 | `components/ImageGallery.tsx` | Chi tiết |
| `FilterBar` (sidebar + chip + bottom sheet) | 2 | `components/FilterBar.tsx` | Trang chủ |
| `BottomNav` | 2 | `layouts/BottomNav.tsx` | Mobile |
| `AdminLayout` | 1 | `admin/AdminLayout.tsx` | `/admin/*` |
| `AdminPage`, `DetailDrawer`, `ActionButtons` | 1 | `admin/*.tsx` | Mọi trang admin |
| `FilterPanel` (+ `filters.ts`) | 1 | `admin/FilterPanel.tsx` | Bộ lọc khai báo bằng field (text, số, chọn, chọn nhiều, khoảng ngày), lọc ngay, lưu trên URL |
| `CrudPage` | 1 | `admin/CrudPage.tsx` | Danh mục, Điểm giao nhận: bảng + tìm kiếm + Drawer thêm/sửa + xóa có xác nhận |
| `RemoteSelect` | 1 | `admin/RemoteSelect.tsx` | Chọn người dùng / danh mục bằng tìm kiếm từ server, giá trị là id |
| `ImageUploader` | 2 | `components/ImageUploader.tsx` | Form đăng bán: lưới ảnh, xem trước, kiểm tra JPG/PNG/WebP ≤ 5 MB, tối đa 6 ảnh |
| `KpiTile` | 1 | `admin/KpiTile.tsx` | Tổng quan |

Mọi component có trang xem thử: `/dev/ui` (người dùng) và `/dev/admin` (admin), dùng dữ liệu giả, chỉ bật khi `NODE_ENV !== 'production'`.

## 5. Checklist trước khi merge PR giao diện

- [ ] Chỉ dùng token và theme có sẵn, không có mã màu hex mới trong component.
- [ ] Xem ở 375px và 1280px: không cuộn ngang, không chữ tràn, nút không xuống dòng.
- [ ] Có đủ trạng thái đang tải / rỗng / lỗi.
- [ ] Nút và chữ đạt tương phản AA; ô nhập có label phía trên, lỗi hiện phía dưới.
- [ ] Nhãn nút đúng bảng ở mục 3.
- [ ] Icon lấy từ Phosphor; ảnh có `alt`.
- [ ] Không có dấu gạch dài (—), emoji, hay nhãn đè lên ảnh.
