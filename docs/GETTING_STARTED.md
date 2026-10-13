# Hướng dẫn start project

Làm một lần khi mới clone repo. Mất khoảng 20–30 phút; phần lâu nhất là cấu hình Supabase.

## 1. Cài công cụ

| Công cụ | Phiên bản | Kiểm tra |
|---|---|---|
| .NET SDK | 10.x | `dotnet --version` |
| Node.js | ≥ 20 (nhóm đang dùng 25) | `node --version` |
| Git | bất kỳ | `git --version` |

Không cần Docker, không cần cài Postgres: database dùng Supabase Cloud.
Không cần cài `dotnet-ef` global: repo có sẵn bản local trong `backend/dotnet-tools.json`.

## 2. Supabase

> Chỉ **một người** tạo project rồi mời cả nhóm vào (Dashboard → Organization → Members). Mọi người dùng chung một project dev.

### 2.1 Tạo project
1. Vào [supabase.com](https://supabase.com) → **New project**.
2. Region chọn **Southeast Asia (Singapore)**.
3. Đặt **Database password** và gửi riêng cho nhóm. Không commit mật khẩu này.

### 2.2 Lấy key

| Cần lấy | Ở đâu trong Dashboard | Điền vào |
|---|---|---|
| Project URL | Project Settings → API (Data API) | `SUPABASE_URL`, `VITE_SUPABASE_URL` |
| anon / publishable key | Project Settings → API Keys | `VITE_SUPABASE_ANON_KEY` (frontend) |
| service_role / secret key | Project Settings → API Keys | `SUPABASE_SERVICE_ROLE_KEY` (**chỉ backend**) |
| Connection string | Nút **Connect** (đầu trang) → **Session pooler** → .NET | `ConnectionStrings__DefaultConnection` |
| JWT secret (chỉ project dùng Legacy JWT) | Project Settings → JWT Keys | `SUPABASE_JWT_SECRET` |

> ⚠️ `service_role` key bỏ qua mọi RLS. **Không bao giờ** đặt key này vào `frontend/.env`, gửi lên chat công khai hay commit.
>
> Nên dùng **Session pooler** (cổng 5432) thay cho Direct connection, vì Direct connection chỉ có IPv6 nên nhiều mạng (wifi trường, 4G) không kết nối được. Không dùng Transaction pooler (cổng 6543) để chạy migration.

### 2.3 Cấu hình đăng nhập (Authentication)

1. **URL Configuration**:
   - Site URL: `http://localhost:5174`
   - Redirect URLs: thêm `http://localhost:5174/login`
2. **Google** (email trường `@gm.uit.edu.vn` cũng là tài khoản Google):
   1. Vào [Google Cloud Console](https://console.cloud.google.com) → APIs & Services → Credentials → **Create OAuth client ID** (Web application).
   2. Authorized redirect URI: lấy dòng **Callback URL** hiện trong trang Supabase → Authentication → Providers → Google (dạng `https://<ref>.supabase.co/auth/v1/callback`).
   3. Dán Client ID và Client Secret vào Supabase, rồi bật provider Google.
3. **Email + mật khẩu** (dự phòng khi dev): Providers → Email. Khi dev nên **tắt "Confirm email"**, vì SMTP mặc định của Supabase giới hạn số mail gửi mỗi giờ.

## 3. File môi trường

```bash
cp backend/.env.example backend/.env
```

```bash
cp frontend/.env.example frontend/.env
```

Mở hai file vừa tạo và điền giá trị ở bước 2.2. Cả hai đã nằm trong `.gitignore`, không bị commit.

## 4. Cài package

```bash
cd backend && dotnet restore && dotnet tool restore
```

```bash
npm --prefix frontend install
```

## 5. Tạo bảng trong database

Làm theo [MIGRATIONS.md](MIGRATIONS.md). Người đầu tiên của nhóm chạy `database update`; những người sau chỉ cần chạy lại khi có migration mới.

> Khung hiện tại **chưa có migration** vì schema đang chờ nhóm chốt (xem [DATABASE.md](DATABASE.md)). Trước khi có migration, backend vẫn chạy được, nhưng `/api/me` sẽ lỗi vì chưa có bảng `profiles`.

## 6. Chạy

Mở 2 terminal:

```bash
dotnet run --project backend/Api
```

```bash
npm --prefix frontend run dev
```

| Dịch vụ | URL |
|---|---|
| Frontend | http://localhost:5174 |
| Backend API | http://localhost:5180 |
| Swagger (thử API) | http://localhost:5180/swagger |

Frontend proxy `/api` sang backend (xem `frontend/vite.config.ts`), nên khi dev không cần cấu hình CORS.

**Dùng Claude desktop app:** `.claude/launch.json` đã khai báo sẵn hai cấu hình `frontend` và `backend`, cứ bảo Claude "chạy project" là được.

## 7. Kiểm tra mọi thứ đã nối đúng

1. Mở http://localhost:5174, bấm **Đăng nhập**, đăng nhập bằng email `@gm.uit.edu.vn`.
2. Vào Supabase → Table Editor → `profiles`: phải có một dòng mới với email của bạn.
3. Mở DevTools → Network, tải lại trang: request `GET /api/me` phải trả `200`.
4. Đăng nhập bằng email trường thì `profiles.is_uit_verified = true`; bằng Gmail cá nhân thì `false`.

### Cấp quyền admin cho thành viên nhóm

Supabase → SQL Editor:

```sql
update public.profiles set role = 'admin' where email = 'mssv@gm.uit.edu.vn';
```

Đăng xuất rồi đăng nhập lại (hoặc tải lại trang) để menu admin hiện ra.

## 8. Lệnh thường dùng

| Việc | Lệnh |
|---|---|
| Test backend | `dotnet test backend` |
| Test frontend | `npm --prefix frontend test` |
| Typecheck frontend | `npm --prefix frontend run typecheck` |
| Lint frontend | `npm --prefix frontend run lint` |
| Build frontend production | `npm --prefix frontend run build` |
| Thêm / chạy migration | xem [MIGRATIONS.md](MIGRATIONS.md) |

## 9. Lỗi hay gặp

| Triệu chứng | Nguyên nhân / cách sửa |
|---|---|
| `401` mọi request có token | `SUPABASE_URL` trong `backend/.env` sai, hoặc project dùng Legacy JWT mà chưa điền `SUPABASE_JWT_SECRET`. Restart backend sau khi sửa `.env` |
| `403 Tài khoản bị từ chối truy cập` | Chưa có dòng trong `profiles` (đăng ký trước khi chạy migration) hoặc `is_active = false`. Xóa user trong Authentication → Users rồi đăng nhập lại |
| Đăng nhập Google xong quay về `/login` báo lỗi | Thiếu `http://localhost:5174/login` trong Redirect URLs, hoặc email không thuộc domain trường |
| `Failed to connect` / timeout khi chạy backend hoặc migration | Đang dùng Direct connection (IPv6). Đổi sang Session pooler |
| Frontend báo `supabaseUrl is required` | Chưa tạo `frontend/.env`, hoặc tạo xong mà chưa restart `npm run dev` |
| Project Supabase "Paused" | Gói free tự tạm dừng khi bỏ không khoảng 1 tuần. Vào Dashboard bấm **Restore** |
| Cổng 5174/5180 đã bị dùng | Tắt tiến trình cũ, hoặc đổi cổng trong `frontend/package.json` / `backend/Api/Properties/launchSettings.json` (nhớ sửa luôn proxy trong `vite.config.ts`) |
