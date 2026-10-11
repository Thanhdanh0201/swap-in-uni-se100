# Cơ sở dữ liệu (đề xuất)

> Bản nháp để nhóm góp ý trước khi viết entity/migration. Hiện code mới có bảng `profiles`.
> Đã cập nhật theo phạm vi use case chốt ngày 2026-10-11 (thêm `wanted_posts`, `meeting_points`).
> Quy ước: tên bảng/cột `snake_case` (DbContext tự đổi từ PascalCase); khóa chính `uuid` sinh bằng `gen_random_uuid()`; thời gian dùng `timestamptz` (UTC).

## ERD

```mermaid
erDiagram
    AUTH_USERS ||--|| PROFILES : "id"
    PROFILES ||--o{ LISTINGS : "đăng"
    CATEGORIES ||--o{ LISTINGS : "phân loại"
    CATEGORIES ||--o{ CATEGORIES : "danh mục con"
    LISTINGS ||--o{ LISTING_IMAGES : "có ảnh"
    PROFILES ||--o{ FAVORITES : "lưu"
    LISTINGS ||--o{ FAVORITES : ""
    LISTINGS ||--o{ CONVERSATIONS : "về bài"
    PROFILES ||--o{ CONVERSATIONS : "buyer / seller"
    CONVERSATIONS ||--o{ MESSAGES : "gồm"
    CONVERSATIONS ||--o{ PURCHASE_REQUESTS : "gửi trong"
    LISTINGS ||--o{ PURCHASE_REQUESTS : ""
    PURCHASE_REQUESTS ||--o{ REVIEWS : "sau giao dịch"
    LISTINGS ||--o{ REPORTS : "bị báo cáo"
    PROFILES ||--o{ REPORTS : "báo cáo / bị báo cáo"
    PROFILES ||--o{ NOTIFICATIONS : "nhận"
    PROFILES ||--o{ WANTED_POSTS : "đăng tin cần mua"
    CATEGORIES ||--o{ WANTED_POSTS : ""
    WANTED_POSTS ||--o{ CONVERSATIONS : "về tin"
    WANTED_POSTS ||--o{ REPORTS : "bị báo cáo"
    MEETING_POINTS ||--o{ PURCHASE_REQUESTS : "giao tại"

    PROFILES {
        uuid id PK "= auth.users.id"
        text email UK
        text full_name
        text avatar_url
        text student_id
        text phone
        text role "student | admin"
        bool is_active
        timestamptz created_at
        timestamptz updated_at
    }
    CATEGORIES {
        uuid id PK
        text name
        text slug UK
        uuid parent_id FK
        int sort_order
    }
    LISTINGS {
        uuid id PK
        uuid seller_id FK
        uuid category_id FK
        text title
        text description
        numeric price "VND, >= 0"
        text condition "new | like_new | good | fair"
        text status "pending | approved | rejected | reserved | sold | hidden"
        text reject_reason
        uuid moderated_by
        timestamptz moderated_at
        timestamptz created_at
        timestamptz updated_at
        timestamptz deleted_at "xóa mềm"
    }
    LISTING_IMAGES {
        uuid id PK
        uuid listing_id FK
        text storage_path "sellerId/listingId/file.jpg"
        int position
    }
    FAVORITES {
        uuid user_id PK, FK
        uuid listing_id PK, FK
        timestamptz created_at
    }
    CONVERSATIONS {
        uuid id PK
        uuid listing_id FK "nullable; unique cùng buyer_id"
        uuid wanted_post_id FK "nullable; đúng 1 trong 2"
        uuid buyer_id FK "người nhắn trước"
        uuid seller_id FK "chủ bài / chủ tin"
        timestamptz last_message_at
    }
    MESSAGES {
        uuid id PK
        uuid conversation_id FK
        uuid sender_id FK
        text content "<= 2000 ký tự"
        timestamptz read_at
        timestamptz created_at
    }
    PURCHASE_REQUESTS {
        uuid id PK
        uuid listing_id FK
        uuid buyer_id FK
        uuid conversation_id FK
        numeric offered_price
        text delivery_method "meetup | shipping"
        uuid meeting_point_id FK "nullable"
        text meeting_place "khi không chọn điểm có sẵn"
        timestamptz meeting_time
        text note
        text status "pending | accepted | rejected | cancelled | completed"
    }
    REVIEWS {
        uuid id PK
        uuid purchase_request_id FK
        uuid reviewer_id FK
        uuid reviewee_id FK
        int rating "1..5"
        text comment
    }
    REPORTS {
        uuid id PK
        uuid reporter_id FK
        uuid listing_id FK "nullable"
        uuid wanted_post_id FK "nullable"
        uuid reported_user_id FK "nullable"
        text reason "false_info | inappropriate | scam | prohibited | other"
        text detail
        text status "open | resolved | dismissed"
        uuid handled_by
        timestamptz handled_at
        text resolution
    }
    WANTED_POSTS {
        uuid id PK
        uuid author_id FK
        uuid category_id FK
        text title
        text description
        numeric max_price "nullable"
        text status "pending | open | rejected | closed | hidden"
        text reject_reason
        uuid moderated_by
        timestamptz moderated_at
        timestamptz expires_at "created_at + 30 ngày"
        timestamptz created_at
        timestamptz updated_at
    }
    MEETING_POINTS {
        uuid id PK
        text name "Thư viện – sảnh tầng 1"
        text description
        text suggested_hours
        bool is_active "ẩn thay vì xóa"
        int sort_order
    }
    NOTIFICATIONS {
        uuid id PK
        uuid user_id FK
        text type "listing_approved, new_message, ..."
        jsonb payload
        timestamptz read_at
        timestamptz created_at
    }
```

## Ràng buộc và index nên có

- `CHECK` cho mọi cột trạng thái/enum: dùng `HasCheckConstraint` trong DbContext.
- Mỗi người mua có 1 cuộc trò chuyện cho mỗi bài: `conversations (listing_id, buyer_id)`.
- Mỗi bên đánh giá 1 lần cho mỗi giao dịch: `reviews (purchase_request_id, reviewer_id)`.
- Báo cáo phải có ít nhất một đối tượng: `CHECK (num_nonnulls(listing_id, wanted_post_id, reported_user_id) >= 1)`.
- Cuộc trò chuyện thuộc đúng một đối tượng: `CHECK (num_nonnulls(listing_id, wanted_post_id) = 1)`; unique `(wanted_post_id, buyer_id)`.
- Tin cần mua: tối đa 5 tin `open` mỗi người (kiểm tra ở Business), index `wanted_posts (status, created_at)`.
- Index:
  - `listings (status, created_at)` cho trang chủ.
  - `listings (seller_id)`, `listings (category_id)`.
  - `messages (conversation_id, created_at)`.
  - `reports (status, created_at)`.
- Tìm kiếm không dấu: bật extension `unaccent`, rồi so khớp bằng `EF.Functions.ILike(EF.Functions.Unaccent(title), ...)`.

## Phần riêng của Supabase (viết trong migration bằng `migrationBuilder.Sql`)

1. `profiles.id` khóa ngoại tới `auth.users(id) ON DELETE CASCADE`.
2. Trigger `on_auth_user_created` trên `auth.users`:
   - Từ chối email ngoài `gm.uit.edu.vn` / `uit.edu.vn`.
   - Tự tạo `profiles` (lấy `full_name`, `avatar_url` từ metadata Google).
3. `ENABLE ROW LEVEL SECURITY` cho **mọi** bảng: không có policy thì trình duyệt không đọc/ghi được qua anon key.
4. Chỉ mở policy `SELECT` cho bảng frontend nghe Realtime:
   - `conversations`, `messages`: người đọc phải là `buyer_id` hoặc `seller_id` (so với `auth.uid()`).
   - `notifications`: `user_id = auth.uid()`.
   - Bảng mới (`wanted_posts`, `meeting_points`) cũng phải `ENABLE ROW LEVEL SECURITY`, không cần policy.
5. `ALTER PUBLICATION supabase_realtime ADD TABLE messages, notifications;`
6. Tạo bucket `listing-images` (public read; giới hạn 5 MB; jpeg/png/webp).
7. Seed điểm giao nhận mẫu (thư viện, căng tin, sảnh tòa A/B...) và danh mục: Sách & Giáo trình, Đồ điện tử, Quần áo & Phụ kiện, Đồ dùng ký túc xá, Dụng cụ học tập, Xe & Phương tiện, Khác.
