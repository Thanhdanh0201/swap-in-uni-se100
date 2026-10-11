# QUY TẮC CHO AI - SWAPINUNI BACKEND

## 1. Phạm vi & Công nghệ
- Chỉ viết RESTful API. Không sinh code giao diện.
- ASP.NET Core (.NET 10), EF Core Code-First, PostgreSQL trên Supabase, FluentValidation.

## 2. Kiến trúc (N-Tier)
- `Api`: Controllers (chỉ trả JSON bọc `ApiResponse`), Middlewares, cấu hình JWT.
- `Business`: Services (nghiệp vụ), DTOs, Validators, Interfaces.
- `Data`: DbContext, Entities, Repositories/UnitOfWork, Migrations.
- `Shared`: Constants (trạng thái, role), Exceptions, Responses, Helpers.

## 3. Ràng buộc cốt lõi
- **Auth**: Supabase Auth ở frontend; backend chỉ xác thực JWT (Bearer). Role lấy từ `profiles.role` (RbacMiddleware), không tin claim trong token.
- **Phân quyền**: mọi controller có `[Authorize]` hoặc `[AllowAnonymous]` tường minh. Quyền chủ sở hữu kiểm tra trong Service.
- **RLS**: backend kết nối bằng user postgres nên bỏ qua RLS. RLS chỉ để chặn trình duyệt; chỉ mở SELECT cho bảng frontend nghe Realtime (conversations, messages, notifications). Ghi luôn qua API.
- **Kiểm duyệt**: bài mới và bài vừa sửa luôn về `pending`. Chỉ `approved`/`reserved` hiện công khai.
- **Xóa mềm**: `listings.deleted_at` + query filter.
- **Database**: schema đề xuất ở `../docs/DATABASE.md`; đổi schema chỉ bằng `dotnet ef migrations add`. SQL riêng Supabase (trigger, RLS, publication) viết trong migration bằng `migrationBuilder.Sql`.
- **Lỗi**: ném `AppException` (status + code + message tiếng Việt); GlobalExceptionMiddleware trả ProblemDetails.

## 4. Lệnh cấm
- Không đoán khi thiếu thông tin, hãy hỏi lại.
- Không phá vỡ N-Tier, không truy vấn DB từ Controller.
- Không đưa service role key hay connection string vào frontend hoặc commit.

## 5. Cập nhật context
Khi được yêu cầu "cập nhật context": sửa `../docs/TODO.md` (Completed / In Progress / Next) và thêm ADR vào `../docs/DECISIONS.md` nếu có quyết định thiết kế mới.
