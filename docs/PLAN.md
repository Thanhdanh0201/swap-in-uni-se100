# Kế hoạch thực hiện (13/10 – 28/12/2026)

> 4 người · 5 sprint × 2 tuần + 1 tuần chốt · quản lý task trên Jira.
> Checklist chi tiết từng việc: [TODO.md](TODO.md). Mã UC: [USE_CASES.md](USE_CASES.md).
> Jira: [board SCRUM](https://swap-in-uni-uit.atlassian.net/jira/software/projects/SCRUM/boards/1). Mỗi việc ở bảng dưới là 1 issue, label `TV1`–`TV4` = người phụ trách, `be`/`fe` = tầng, `P1`–`P3` = ưu tiên.
> Epic: SCRUM-5 Thiết kế & tài liệu · SCRUM-6 Hạ tầng & DevOps · SCRUM-7 Đăng bán & tra cứu · SCRUM-8 Kiểm duyệt & quản trị · SCRUM-9 Giao dịch · SCRUM-10 Cộng đồng & an toàn · SCRUM-11 Chất lượng & kiểm thử.

## Tổng quan

| Sprint | Thời gian | Mục tiêu | Demo cuối sprint | Mốc nộp |
|---|---|---|---|---|
| **S1** | 13/10 – 25/10 | Thiết kế xong, hạ tầng chạy, deploy được bản rỗng | Đăng nhập email trường trên link online, `/api/me` trả về hồ sơ | – |
| **S2** | 26/10 – 08/11 | MVP đăng bán: đăng bài, duyệt, xem, tìm | Đăng bài, admin duyệt, người khác tìm thấy | **Báo cáo giữa kỳ** *(giả định ~08/11)* |
| **S3** | 09/11 – 22/11 | Giao dịch: chat realtime, yêu cầu mua | Hai tài khoản chat realtime, gửi và chấp nhận yêu cầu mua | – |
| **S4** | 23/11 – 06/12 | An toàn và cộng đồng: báo cáo, đánh giá, tin cần mua, quản trị | Báo cáo → admin gỡ bài/khóa tài khoản; đánh giá sau giao dịch | – |
| **S5** | 07/12 – 20/12 | Hoàn thiện: thông báo, thống kê, P3, kiểm thử, tối ưu | Toàn bộ luồng chính trên bản deploy, không lỗi chặn | – |
| **Chốt** | 21/12 – 28/12 | Đóng băng tính năng, sửa lỗi, báo cáo, slide, video | Buổi tổng duyệt nội bộ | **Nộp cuối kỳ 28/12** |

Ưu tiên khi trễ: P1 (13 UC) phải xong trước hết S3. P2 làm ở S4. P3 (UC12 Yêu thích, UC26 Thống kê) bỏ được nếu thiếu thời gian.

## Phân vai (đề xuất)

| Thành viên | Vai trò chính | Phụ trách |
|---|---|---|
| **TV1** – [tên] | Trưởng nhóm, Backend | Kiến trúc, migration/RLS, review PR backend, Jira, liên lạc giảng viên |
| **TV2** – [tên] | Backend | Nghiệp vụ giao dịch: chat, yêu cầu mua, thông báo, tin cần mua |
| **TV3** – [tên] | Frontend | Trang công khai (trang chủ, chi tiết, tìm kiếm), đăng bán, chat UI |
| **TV4** – [tên] | Frontend + QA/Docs | Trang admin, quản lý bài, test luồng, deploy, báo cáo/slide |

Mỗi tính năng làm theo cặp **backend + frontend**: hai bên chốt DTO trước (ghi vào PR mô tả), rồi code song song.

## Chi tiết từng sprint

### S1 · 13/10 – 25/10 · Thiết kế + hạ tầng

| Việc | Ai | UC / ghi chú |
|---|---|---|
| Chốt giả định và câu hỏi mở (mục 8 USE_CASES), duyệt ERD, DECISIONS | Cả nhóm | Họp đầu sprint |
| Tạo Jira board, quy ước branch/PR, bảo vệ nhánh `main` | TV1 | |
| SRS: mô tả hệ thống, yêu cầu chức năng, phi chức năng | TV4 + TV2 | Dùng lại USE_CASES.md |
| Wireframe Figma 6 màn: trang chủ, chi tiết, đăng bán, chat, bài của tôi, admin duyệt | TV3 | Dùng token màu/font hiện có |
| Tạo project Supabase, Google OAuth, Redirect URLs | TV1 | GETTING_STARTED.md |
| Entity + migration toàn bộ schema theo ERD, migration `SupabaseSetup` | TV1 + TV2 | Một người tạo migration tại một thời điểm |
| Seed dữ liệu mẫu: danh mục, điểm giao nhận, 20 bài mẫu | TV2 | Để demo và test giao diện |
| Deploy bản rỗng: backend Docker (Render), frontend Node (Render/Vercel) | TV4 | Deploy sớm để tránh rủi ro cuối kỳ |
| Kiểm tra đăng nhập end-to-end trên bản deploy | TV3 + TV4 | |

**Xong khi:** đăng nhập bằng email trường trên link online; email ngoài trường bị từ chối; `profiles` có dữ liệu.

### S2 · 26/10 – 08/11 · MVP đăng bán

| Việc | Ai | UC |
|---|---|---|
| API danh mục, đăng bài, upload ảnh Storage | TV1 | UC18 |
| API danh sách, tìm không dấu, lọc, chi tiết | TV1 | UC04, UC05, UC06 |
| API bài của tôi: sửa (về pending), ẩn/hiện, đã bán | TV2 | UC19 |
| API kiểm duyệt: hàng đợi, duyệt, từ chối kèm lý do | TV2 | UC21 |
| Trang chủ (lưới + bộ lọc SSR), trang chi tiết (SSR + OG) | TV3 | UC04–06 |
| Form đăng bán / sửa bài (upload ảnh) | TV3 | UC18, UC19 |
| Trang bài của tôi, trang admin duyệt | TV4 | UC19, UC21 |
| Unit test service: quyền chủ bài, chuyển trạng thái | TV1 + TV2 | |
| **Báo cáo giữa kỳ**: SRS, use case + đặc tả, ERD, kiến trúc, ảnh màn hình MVP | TV4 (chính) + cả nhóm | Hạn ~08/11 |

**Xong khi:** người bán đăng bài có ảnh → admin duyệt → người khác tìm "giao trinh" ra bài đó; share link có ảnh và giá.

### S3 · 09/11 – 22/11 · Giao dịch

| Việc | Ai | UC |
|---|---|---|
| API chat: mở cuộc trò chuyện, danh sách, tin nhắn, gửi | TV2 | UC09 |
| RLS + Realtime cho `messages`; test người ngoài không nhận được | TV1 | UC09 |
| API yêu cầu mua: gửi (chọn điểm giao nhận), hủy, chấp nhận, từ chối, hoàn tất, hủy giao dịch | TV1 + TV2 | UC13, UC14, UC20 |
| Màn chat realtime, thẻ yêu cầu mua trong chat | TV3 | UC09, UC13 |
| Màn xử lý yêu cầu mua của người bán | TV4 | UC20 |
| Đăng xuất, xử lý tài khoản bị khóa ở UI | TV4 | UC02 |
| Test luồng giao dịch đầy đủ trên 2 trình duyệt | TV4 | |

**Xong khi:** đủ 13 use case P1; luồng 8 bước ở slide "Luồng chính" chạy được trên bản deploy.

### S4 · 23/11 – 06/12 · An toàn + cộng đồng

| Việc | Ai | UC |
|---|---|---|
| Báo cáo vi phạm + admin xử lý (bỏ qua, gỡ bài, khóa) | TV1 | UC10, UC22 |
| Quản lý người dùng, danh mục, điểm giao nhận | TV1 + TV4 | UC23, UC24, UC25 |
| Đánh giá hai chiều, hồ sơ người bán | TV2 + TV3 | UC15, UC07 |
| Tin cần mua: đăng, quản lý, duyệt chung hàng đợi, trang xem | TV2 + TV3 | UC16, UC17, UC08 |
| Cập nhật hồ sơ | TV3 | UC03 |
| Rate limit đăng bài, gửi tin, báo cáo | TV1 | |

**Xong khi:** đủ P2 trừ thông báo; báo cáo → gỡ bài → người bị khóa không đăng nhập được.

### S5 · 07/12 – 20/12 · Hoàn thiện

| Việc | Ai | UC |
|---|---|---|
| Thông báo realtime (chuông, đã đọc) | TV2 + TV3 | UC11 |
| Thống kê admin, yêu thích | TV1 + TV4 | UC26, UC12 (P3) |
| Responsive mobile, trạng thái loading/lỗi/rỗng, chỉnh giao diện | TV3 | `/redesign-existing-projects` |
| Test end-to-end, test RLS, sửa lỗi | TV4 + cả nhóm | |
| `/ponytail-audit` toàn repo, xử lý phát hiện mức cao | TV1 | |
| Seed dữ liệu demo thật (ảnh thật, 50+ bài) | TV2 | |

**Xong khi:** không còn lỗi chặn; mọi màn có trạng thái rỗng/lỗi; chạy tốt trên điện thoại.

### Chốt · 21/12 – 28/12 · Đóng băng tính năng

| Việc | Ai |
|---|---|
| Chỉ sửa lỗi, không thêm tính năng (từ 21/12) | Cả nhóm |
| Báo cáo cuối kỳ: cập nhật từ báo cáo giữa kỳ + kết quả, kiểm thử, hướng phát triển | TV4 + TV1 |
| Slide thuyết trình (dựa trên slide tổng quan) | TV3 |
| Video demo 5–7 phút theo luồng chính | TV2 |
| Tổng duyệt nội bộ ~26/12; mở project Supabase trước buổi bảo vệ | Cả nhóm |

## Nhịp làm việc

| Hoạt động | Khi nào | Ghi chú |
|---|---|---|
| Sprint planning | Thứ Hai đầu sprint, 45 phút | Kéo task từ backlog Jira, ước lượng story point |
| Daily (chat nhóm) | Hằng ngày | 3 dòng: hôm qua, hôm nay, vướng gì |
| Review / demo | Chủ Nhật cuối sprint | Demo trên bản deploy, không demo trên máy cá nhân |
| Retro | Ngay sau demo, 15 phút | 1 điều giữ, 1 điều đổi |

## Quy ước

- **Branch:** `feat/UC18-dang-bai`, `fix/...`. Không push thẳng `main`; mọi thay đổi qua PR có ít nhất 1 người review.
- **Commit:** Conventional Commits (`feat:`, `fix:`, `docs:`...), có thể dùng `/caveman-commit`.
- **Định nghĩa "xong" (DoD):** code đã merge, build và test pass, có test cho logic mới, chạy được trên bản deploy, Jira chuyển Done, cập nhật TODO.md nếu cần.
- **Migration:** báo nhóm trước khi tạo; một người tạo tại một thời điểm (MIGRATIONS.md).

## Rủi ro

| Rủi ro | Cách giảm |
|---|---|
| Realtime + RLS khó, dễ trễ | Làm ở đầu S3, TV1 thử prototype ngay trong S2 |
| Deploy lỗi sát hạn | Deploy từ S1, mỗi sprint demo trên bản deploy |
| Supabase free tự tạm dừng | Mở dashboard trước mỗi buổi demo |
| Thành viên bận thi giữa kỳ (tháng 11) | Dồn P1 vào S2–S3, S4 chỉ có P2 |
| Conflict migration | Một người tạo migration tại một thời điểm, báo trong nhóm |
| Báo cáo dồn cuối kỳ | Báo cáo giữa kỳ làm kỹ; TV4 cập nhật tài liệu dần mỗi sprint |
