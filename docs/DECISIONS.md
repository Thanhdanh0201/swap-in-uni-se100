# Quyết định thiết kế (ADR)

> Trạng thái: **Đề xuất**, chờ nhóm duyệt. Khi duyệt xong, đổi thành **Chấp nhận**. Nếu bỏ, đổi thành **Bác bỏ** kèm lý do.

## ADR-001: Dùng lại stack của dự án CRM UIT — *Đề xuất*
React Router (SSR) + Ant Design ở frontend; ASP.NET Core N-Tier + EF Core ở backend; Supabase làm Postgres, Auth, Storage, Realtime.
**Lý do:** đã có người trong nhóm quen; máy đã cài .NET 10 + Node; tái sử dụng được middleware, cấu trúc và quy ước.
**Đánh đổi:** hai runtime (.NET + Node) nên deploy phức tạp hơn so với chỉ dùng Next.js + Supabase.

## ADR-002: SSR cho trang công khai — *Đề xuất*
Trang danh sách và chi tiết sản phẩm render ở server, có thẻ `og:image`, `og:title`, giá.
**Lý do:** sinh viên hay share link vào nhóm Zalo/Facebook; preview có ảnh và giá thì hấp dẫn hơn. Trang cần đăng nhập thì render ở client.

## ADR-003: Chat realtime bằng Supabase Realtime, không dùng SignalR — *Đề xuất*
Gửi tin qua API backend để kiểm tra quyền. Trình duyệt subscribe `postgres_changes` (INSERT trên `messages`), RLS chỉ cho hai bên đọc.
**Lý do:** ít code, không phải tự quản lý websocket.
**Đánh đổi:** cần supabase-js ở frontend và phải viết RLS cẩn thận.

## ADR-004: Đăng nhập ở frontend bằng supabase-js, gửi Bearer token — *Đề xuất*
Khác CRM (ở đó backend giữ cookie HttpOnly). Realtime cần access token trong trình duyệt, nên để supabase-js quản lý phiên. Backend chỉ xác thực JWT qua JWKS.

## ADR-005: Chỉ email trường được đăng ký — *Đề xuất*
Chặn ở trigger DB `handle_new_user`, không chỉ ở UI. Tham số `hd=gm.uit.edu.vn` của Google chỉ là gợi ý, không chặn được.

## ADR-006: Mọi bài phải qua kiểm duyệt — *Đề xuất*
Bài mới, bài vừa sửa và bài hiện lại sau khi ẩn đều về `pending`, tránh lách kiểm duyệt bằng cách đăng nội dung hợp lệ rồi sửa.

## ADR-007: Bucket ảnh public, upload qua backend — *Đề xuất*
`listing-images` cho đọc công khai để `<img>` và thẻ OG dùng thẳng URL. Upload bằng service role sau khi backend kiểm tra chủ bài, định dạng, kích thước, số ảnh.

## ADR-008: Không xử lý thanh toán — *Đề xuất*
Giao dịch trực tiếp trong trường; hệ thống chỉ ghi nhận yêu cầu mua và trạng thái. Giảm rủi ro pháp lý và phạm vi đồ án.
