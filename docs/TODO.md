# Việc cần làm

> Cập nhật: 2026-10-11. Đánh dấu `[x]` khi xong. Mã UC tham chiếu [USE_CASES.md](USE_CASES.md).

## Đã có (khung)

- [x] Solution backend N-Tier: Api / Business / Data / Shared / Business.Tests. Build sạch, 3 test mẫu pass.
- [x] Xác thực JWT Supabase (JWKS ES256, có dự phòng HS256 secret), `RbacMiddleware` nạp role từ `profiles`, `GlobalExceptionMiddleware` (ProblemDetails), `ApiResponse`, `AppException`.
- [x] `BaseRepository<T>` + `UnitOfWork`; `DotEnv` đọc `backend/.env`; `dotnet-ef` cài dạng local tool.
- [x] Endpoint mẫu `GET /api/me`.
- [x] Frontend React Router v8 SSR + Ant Design, layout, trang chủ tạm, đăng nhập Supabase (Google `hd=gm.uit.edu.vn` / email + mật khẩu).
- [x] `AuthProvider`, `RequireAuth`, `api()` tự gắn Bearer token, `ClientOnly` cho trang cần đăng nhập, route `/admin` có giới hạn role.

## Giai đoạn 0 – Thống nhất nhóm (tuần 1)

- [x] Chốt tên dự án: **SwapInUni** (đã đổi trong code và docs).
- [x] Chốt phạm vi use case, vẽ use case diagram (tổng quát + 4 phân rã, `diagrams/png/`).
- [ ] Xác nhận các giả định và câu hỏi còn mở ở mục 8 trong [USE_CASES.md](USE_CASES.md).
- [ ] Duyệt ERD ở [DATABASE.md](DATABASE.md) và các quyết định ở [DECISIONS.md](DECISIONS.md).
- [ ] Chia việc, tạo board (Jira/Trello/GitHub Projects), quy ước branch và PR.
- [ ] Viết SRS, làm wireframe Figma cho các màn chính.
- [ ] Tạo repo Git và push khung lên.

## Giai đoạn 1 – Hạ tầng (tuần 2)

- [ ] Làm theo [GETTING_STARTED.md](GETTING_STARTED.md): tạo project Supabase, chia sẻ quyền cho cả nhóm, điền `backend/.env` và `frontend/.env`.
- [ ] Supabase Auth:
  - Bật Google provider (tạo OAuth client trên Google Cloud Console).
  - Thêm `http://localhost:5174/login` vào Redirect URLs.
  - (Nếu dùng mật khẩu) tắt "Confirm email" khi dev.
- [ ] Viết entity theo ERD, rồi chạy `dotnet ef migrations add InitialCreate -p Data -s Data -o Migrations`.
- [ ] Viết migration `SupabaseSetup` (trigger email trường, RLS, publication Realtime, bucket ảnh, seed danh mục; xem DATABASE.md).
- [ ] Chạy `dotnet ef database update`, kiểm tra đăng nhập tạo được `profiles`, gọi `/api/me` thành công.
- [ ] Tự cấp quyền admin cho thành viên nhóm: `update profiles set role = 'admin' where email = '...'`.

## Giai đoạn 2 – MVP mua bán (tuần 3–5)

**Backend**
- [ ] UC18 `POST /api/listings` (validator), `POST /api/listings/{id}/images` (upload Supabase Storage).
- [ ] UC04/05/06 `GET /api/listings` (tìm không dấu, lọc, sắp xếp, phân trang), `GET /api/listings/{id}`, `GET /api/categories`.
- [ ] UC19 `GET /api/listings/mine`, `PUT /api/listings/{id}` (quay về pending), ẩn/hiện, đánh dấu đã bán.
- [ ] UC21 `GET /api/admin/listings?status=pending`, approve, reject (kèm lý do).
- [ ] Unit test cho từng service: quyền chủ bài, chuyển trạng thái, ẩn bài chưa duyệt với người khác.

**Frontend**
- [ ] Trang chủ: lưới sản phẩm, bộ lọc bằng query string, phân trang (loader SSR).
- [ ] Trang chi tiết `/listings/:id` (SSR, thẻ OG ảnh + giá), gallery ảnh.
- [ ] `/sell` (form Ant Design + upload ảnh), `/sell/:id` sửa bài.
- [ ] `/me/listings`: bảng bài của tôi, trạng thái, lý do bị từ chối, các thao tác.
- [ ] `/admin`: hàng đợi duyệt, Drawer xem chi tiết, duyệt hoặc từ chối.

## Giai đoạn 3 – Giao dịch (tuần 6–7)

- [ ] UC09 Chat:
  - Backend: mở cuộc trò chuyện, danh sách, lấy tin (phân trang `before`), gửi tin.
  - Frontend: hook `useRealtimeMessages` (supabase-js `postgres_changes` INSERT trên `messages`, lọc theo `conversation_id`), gộp trùng theo id.
- [ ] UC13/14/20 Yêu cầu mua (UC13 kèm chọn điểm giao nhận):
  - Gửi, hủy, chấp nhận (bài thành `reserved`), từ chối, hoàn tất (bài thành `sold`, tự từ chối các yêu cầu còn lại).
  - Hiển thị yêu cầu dạng thẻ trong khung chat.
- [ ] UC11 Thông báo: ghi `notifications` khi duyệt/từ chối bài, có tin nhắn mới, có yêu cầu mua. Chuông thông báo nghe Realtime; có đánh dấu đã đọc.

## Giai đoạn 4 – An toàn và hoàn thiện (tuần 8)

- [ ] UC10 Báo cáo: form chọn lý do. UC22 admin xử lý: bỏ qua, gỡ bài, khóa tài khoản.
- [ ] UC23 Quản lý người dùng (khóa/mở khóa, cấp admin). UC24 Quản lý danh mục. UC25 Quản lý điểm giao nhận.
- [ ] UC15 Đánh giá hai chiều sau giao dịch; UC07 hồ sơ người bán có điểm uy tín.
- [ ] UC16/17 Tin cần mua (đăng, duyệt chung hàng đợi UC21, sửa, đóng, tự đóng sau 30 ngày); UC08 trang xem tin cần mua.
- [ ] UC12 Yêu thích, UC03 Cập nhật hồ sơ.
- [ ] Rate limit cho API đăng bài, gửi tin, báo cáo.

## Giai đoạn 5 – Kiểm thử và bàn giao (tuần 9–10)

- [ ] Test RLS: đăng nhập user khác, thử subscribe tin nhắn của người khác, phải không nhận được gì.
- [ ] Test end-to-end luồng chính (sequence diagram trong USE_CASES.md).
- [ ] UC26 Dashboard thống kê (nếu còn thời gian).
- [ ] Deploy: backend (Docker), frontend (Node), cập nhật Redirect URLs của Supabase Auth.
- [ ] Hoàn thiện báo cáo, slide, video demo. Nhớ mở project Supabase trước buổi demo: gói free tự tạm dừng project nếu bỏ không khoảng 1 tuần.
