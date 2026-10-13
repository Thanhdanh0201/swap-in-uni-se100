# Quyết định thiết kế (ADR)

> Nhóm duyệt ngày 2026-10-13 (SCRUM-12): cả 8 ADR **Chấp nhận**, ADR-005 đổi nội dung. Quyết định mới thêm ADR tiếp theo, trạng thái **Đề xuất** cho tới khi nhóm duyệt.

## ADR-001: Dùng lại stack của dự án CRM UIT — *Chấp nhận*
React Router (SSR) + Ant Design ở frontend; ASP.NET Core N-Tier + EF Core ở backend; Supabase làm Postgres, Auth, Storage, Realtime.
**Lý do:** đã có người trong nhóm quen; máy đã cài .NET 10 + Node; tái sử dụng được middleware, cấu trúc và quy ước.
**Đánh đổi:** hai runtime (.NET + Node) nên deploy phức tạp hơn so với chỉ dùng Next.js + Supabase.

## ADR-002: SSR cho trang công khai — *Chấp nhận*
Trang danh sách và chi tiết sản phẩm render ở server, có thẻ `og:image`, `og:title`, giá.
**Lý do:** sinh viên hay share link vào nhóm Zalo/Facebook; preview có ảnh và giá thì hấp dẫn hơn. Trang cần đăng nhập thì render ở client.

## ADR-003: Chat realtime bằng Supabase Realtime, không dùng SignalR — *Chấp nhận*
Gửi tin qua API backend để kiểm tra quyền. Trình duyệt subscribe `postgres_changes` (INSERT trên `messages`), RLS chỉ cho hai bên đọc.
**Lý do:** ít code, không phải tự quản lý websocket.
**Đánh đổi:** cần supabase-js ở frontend và phải viết RLS cẩn thận.

## ADR-004: Đăng nhập ở frontend bằng supabase-js, gửi Bearer token — *Chấp nhận*
Khác CRM (ở đó backend giữ cookie HttpOnly). Realtime cần access token trong trình duyệt, nên để supabase-js quản lý phiên. Backend chỉ xác thực JWT qua JWKS.

## ADR-005: Mọi email đăng ký được, email trường có huy hiệu UIT — *Chấp nhận*
Ban đầu đề xuất chỉ cho email trường. Nhóm chọn mở rộng để không chặn người ngoài (bạn bè, cựu sinh viên, giảng viên) nhưng vẫn giữ điểm khác biệt "tin cậy trong trường".
Trigger `handle_new_user` không từ chối email nào; nó gán `profiles.is_uit_verified = true` khi domain là `gm.uit.edu.vn` hoặc `uit.edu.vn`. Cột này chỉ trigger ghi, người dùng không sửa được qua API.
**Đánh đổi:** dễ bị tài khoản rác hơn, bù lại bằng kiểm duyệt bài (ADR-006), báo cáo vi phạm và rate limit.

## ADR-006: Mọi bài phải qua kiểm duyệt — *Chấp nhận*
Bài mới, bài vừa sửa và bài hiện lại sau khi ẩn đều về `pending`, tránh lách kiểm duyệt bằng cách đăng nội dung hợp lệ rồi sửa.

## ADR-007: Bucket ảnh public, upload qua backend — *Chấp nhận*
`listing-images` cho đọc công khai để `<img>` và thẻ OG dùng thẳng URL. Upload bằng service role sau khi backend kiểm tra chủ bài, định dạng, kích thước, số ảnh.

## ADR-008: Không xử lý thanh toán — *Chấp nhận*
Giao dịch trực tiếp trong trường; hệ thống chỉ ghi nhận yêu cầu mua và trạng thái. Giảm rủi ro pháp lý và phạm vi đồ án.
