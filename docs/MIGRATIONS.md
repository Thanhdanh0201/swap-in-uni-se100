# Hướng dẫn chạy migration

Schema DB quản lý bằng **EF Core Code-First**: code C# trong `backend/Data` là nguồn chuẩn duy nhất.
**Không** tạo hay sửa bảng bằng tay trên Supabase Dashboard: lần migrate sau sẽ lệch schema hoặc lỗi.

Mọi lệnh dưới đây chạy **trong thư mục `backend/`**. `dotnet-ef` là local tool, nên phải gõ qua `dotnet ef`:

```bash
cd backend && dotnet tool restore
```

Lệnh `dotnet ef` tự đọc `ConnectionStrings__DefaultConnection` trong `backend/.env` (xem `Data/Context/DesignTimeDbContextFactory.cs`). Tạo migration thì không cần DB; còn `database update` thì cần đúng connection string Session pooler.

## Tóm tắt lệnh

| Việc | Lệnh |
|---|---|
| Tạo migration mới | `dotnet ef migrations add <TenMigration> -p Data -s Data -o Migrations` |
| Áp dụng vào DB | `dotnet ef database update -p Data -s Data` |
| Xem danh sách (và cái nào đã áp dụng) | `dotnet ef migrations list -p Data -s Data` |
| Xóa migration **chưa áp dụng** gần nhất | `dotnet ef migrations remove -p Data -s Data` |
| Quay DB về một migration cũ | `dotnet ef database update <TenMigrationCu> -p Data -s Data` |
| Xuất SQL để xem trước | `dotnet ef migrations script -p Data -s Data --idempotent -o migrate.sql` |

`-p Data -s Data`: project chứa migration và project khởi động đều là `Data`. Như vậy chạy được cả khi Api đang build lỗi.

## Quy trình thêm hoặc sửa bảng

1. **Sửa code:**
   - Thêm hoặc sửa class trong `Data/Entities/`.
   - Thêm `DbSet<>` và cấu hình (index, check constraint, quan hệ) trong `Data/Context/ApplicationDbContext.cs`.
   - Thêm repository vào `IUnitOfWork` nếu Business cần dùng.
   - Tên bảng/cột tự đổi sang `snake_case`; `Id`, `CreatedAt`, `UpdatedAt` tự có default (`gen_random_uuid()`, `now()`).
2. **Tạo migration**, đặt tên theo việc vừa làm (PascalCase):
   ```bash
   dotnet ef migrations add AddListings -p Data -s Data -o Migrations
   ```
3. **Đọc file sinh ra** trong `Data/Migrations/<timestamp>_AddListings.cs`. Kiểm tra không có `DropTable`/`DropColumn` ngoài ý muốn (mất dữ liệu).
4. **Áp dụng:**
   ```bash
   dotnet ef database update -p Data -s Data
   ```
5. **Build và test**, rồi commit **cả 3 file**: `<timestamp>_X.cs`, `<timestamp>_X.Designer.cs`, `ApplicationDbContextModelSnapshot.cs`.

Người khác pull về chỉ cần chạy bước 4.

## Migration có SQL riêng của Supabase

Một số thứ EF không mô tả được: trigger trên `auth.users`, RLS policy, publication Realtime, bucket Storage, dữ liệu seed. Cách làm:

1. Tạo migration rỗng (không đổi entity nào):
   ```bash
   dotnet ef migrations add SupabaseSetup -p Data -s Data -o Migrations
   ```
2. Viết SQL vào `Up()`, và lệnh gỡ tương ứng vào `Down()`:
   ```csharp
   protected override void Up(MigrationBuilder migrationBuilder)
   {
       migrationBuilder.Sql("""
           ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

           CREATE POLICY messages_participant_select ON public.messages
               FOR SELECT TO authenticated
               USING (EXISTS (
                   SELECT 1 FROM public.conversations c
                   WHERE c.id = conversation_id AND (SELECT auth.uid()) IN (c.buyer_id, c.seller_id)
               ));

           ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
           """);
   }

   protected override void Down(MigrationBuilder migrationBuilder)
   {
       migrationBuilder.Sql("""
           ALTER PUBLICATION supabase_realtime DROP TABLE public.messages;
           DROP POLICY IF EXISTS messages_participant_select ON public.messages;
           """);
   }
   ```
3. `database update` như bình thường.

Danh sách SQL cần có cho dự án (trigger tạo profile + huy hiệu UIT, RLS, Realtime, bucket ảnh, seed danh mục): xem mục cuối [DATABASE.md](DATABASE.md).

**Lưu ý:**
- Mỗi bảng mới phải kèm `ENABLE ROW LEVEL SECURITY`, nếu không trình duyệt đọc được bảng đó bằng anon key.
- Không sửa schema `auth` hay `storage` ngoài trigger, policy và bucket.

## Làm việc nhóm

- **Không sửa migration đã push.** Muốn đổi thì tạo migration mới.
- **Mỗi lúc chỉ một người tạo migration.** Báo trong nhóm trước khi tạo, vì hai người tạo song song sẽ conflict file `ApplicationDbContextModelSnapshot.cs`.
- Nếu vẫn bị conflict snapshot:
  1. Người merge sau chạy `migrations remove` để bỏ migration của mình (khi nó chưa áp dụng lên DB chung).
  2. Pull code mới nhất.
  3. Chạy lại `migrations add`.
- Dùng chung một DB dev nên chỉ người tạo migration chạy `database update`. Người khác có chạy lại cũng không sao: EF bỏ qua migration đã áp dụng.
- Muốn thử thay đổi lớn mà không ảnh hưởng nhóm: tạo một project Supabase riêng và trỏ `backend/.env` của mình sang đó.

## Rollback

| Tình huống | Cách làm |
|---|---|
| Vừa `add`, **chưa** `update` | `dotnet ef migrations remove -p Data -s Data` |
| Đã `update` lên DB, chưa push | `dotnet ef database update <MigrationTruocDo> -p Data -s Data`, rồi `migrations remove` |
| Đã push / người khác đã áp dụng | Không xóa. Tạo migration mới để sửa |
| Muốn làm sạch DB dev từ đầu | `dotnet ef database update 0 -p Data -s Data` (chạy `Down()` của tất cả migration). **Mất toàn bộ dữ liệu.** Báo nhóm trước |

## Lỗi hay gặp

| Lỗi | Cách sửa |
|---|---|
| `dotnet-ef does not exist` | Chưa chạy `dotnet tool restore` trong `backend/` |
| `Failed to connect` / timeout | Connection string đang dùng Direct (IPv6) hoặc Transaction pooler (6543). Đổi sang **Session pooler** cổng 5432 |
| `password authentication failed` | Sai DB password, hoặc username thiếu phần `.your-project-ref` (Session pooler yêu cầu dạng `postgres.<ref>`) |
| `relation "auth.users" does not exist` | Đang trỏ vào Postgres thường, không phải Supabase. Migration Supabase chỉ chạy trên Supabase |
| `The model for context has pending changes` | Đã sửa entity mà chưa `migrations add` |
| `permission denied for schema auth` | Đang dùng user không phải `postgres`. Dùng connection string mặc định trong nút Connect |
