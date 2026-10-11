# Hướng dẫn sử dụng skill (Claude Code)

Repo có sẵn bộ skill trong `.claude/skills/`, commit cùng code nên ai clone về cũng có. Không cần cài thêm gì.
Các skill này chỉ áp dụng khi dùng **Claude Code** (terminal, desktop app, extension VS Code/JetBrains) mở tại thư mục `SE100`.

## Có gì

| Skill | Bật thế nào | Dùng để làm gì |
|---|---|---|
| `caveman` | **Luôn bật** | Claude trả lời ngắn: vào thẳng vấn đề, bỏ câu xã giao, giữ nguyên code, lệnh, số liệu |
| `ponytail` | **Luôn bật** | Claude viết code tối thiểu mà vẫn đúng: dùng lại cái đã có, không thêm thư viện hay abstraction thừa, cuối câu trả lời nói rõ phần đã bỏ qua và rủi ro |
| `caveman-commit` | Gọi `/caveman-commit` | Viết commit message ngắn, đúng chuẩn Conventional Commits |
| `caveman-review` | Gọi `/caveman-review` | Review PR/diff, mỗi lỗi 1 dòng, dán thẳng vào PR được |
| `ponytail-review` | Gọi `/ponytail-review` | Review chất lượng một diff: bug, bảo mật, thiếu test, chỗ nên cắt |
| `ponytail-audit` | Gọi `/ponytail-audit` | Review như trên nhưng cho cả repo, xếp theo mức độ |
| `ponytail-debt` | Gọi `/ponytail-debt` | Gom các comment `shortcut:` trong code thành danh sách nợ kỹ thuật |
| `ponytail-gain` | Gọi `/ponytail-gain` | Bảng thống kê lượng code và chi phí tiết kiệm được |
| `ponytail-help` | Gọi `/ponytail-help` | Bảng tra nhanh các lệnh ponytail |
| `design-taste-frontend` | Gọi `/design-taste-frontend` | Làm giao diện có gu, tránh kiểu "template AI". Hợp nhất với trang chủ, landing |
| `minimalist-ui` | Gọi `/minimalist-ui` | Phong cách tối giản, sạch |
| `redesign-existing-projects` | Gọi `/redesign-existing-projects` | Làm lại giao diện một trang đã có: audit trước, sửa sau |

"Luôn bật" là vì [CLAUDE.md](../CLAUDE.md) import thẳng hai skill đó, nên mọi phiên mới đều tự nạp.
Skill dạng "gọi" thì Claude cũng có thể tự dùng khi yêu cầu khớp mô tả (ví dụ bạn nói "review diff này").

## Ví dụ dùng

```text
/caveman-commit
```
→ Claude đọc phần thay đổi đã stage và đưa ra commit message dạng `feat(listing): ...`. Claude **không tự commit**, bạn copy rồi tự chạy `git commit`.

```text
/ponytail-review
```
→ Review diff hiện tại trước khi tạo PR.

```text
/redesign-existing-projects trang chủ frontend/src/pages/public/Home.tsx, giữ màu xanh UIT
```

```text
/ponytail ultra thêm tính năng yêu thích sản phẩm
```
→ Trước khi code, Claude hỏi lại xem phần nào thật sự cần làm.

## Bật, tắt, đổi mức

| Muốn | Gõ |
|---|---|
| Tắt trả lời ngắn | `stop caveman` |
| Tắt chế độ code tối thiểu | `stop ponytail` |
| Tắt cả hai, trả lời bình thường | `normal mode` |
| Bật lại | `/caveman`, `/ponytail` |
| Ponytail nhẹ (làm đúng yêu cầu, chỉ gợi ý phương án nhỏ hơn) | `/ponytail lite` |
| Ponytail gắt (phản biện yêu cầu trước khi làm) | `/ponytail ultra` |

Tắt chỉ có tác dụng trong phiên hiện tại; phiên mới tự bật lại.
Muốn tắt hẳn cho riêng máy mình: tạo file `CLAUDE.local.md` ở thư mục gốc (đã có trong `.gitignore`) và ghi "Không dùng caveman", hoặc nói thẳng với Claude ở đầu phiên.

## Quy ước khi làm giao diện

Các skill taste dễ "sáng tạo" ra màu và font mới. Khi gọi, nhớ nhắc Claude:

- Giữ token trong `frontend/src/styles/tokens.css` (xanh UIT `#0041d9`, font Be Vietnam Pro).
- Trang dùng Ant Design thì sửa theme ở `frontend/src/theme.ts`, không override CSS của antd.
- Không cài thêm UI kit (Tailwind, shadcn, MUI…) khi chưa được nhóm đồng ý.
- `design-taste-frontend` hợp với trang chủ và landing, không hợp với bảng admin. Màn quản trị thì dùng Ant Design như bình thường.

## Lưu ý

- Skill ảnh hưởng cách Claude **nói** và **code**. Phần ghi ra file (code, comment, docs, commit) vẫn viết đầy đủ, không nén kiểu caveman.
- Chưa có `/caveman ultra` và `/caveman wenyan`, vì repo chưa copy skill `ultracave`/`megacave`.
- Thành viên dùng Cursor, Copilot hay Kiro sẽ không tự có các skill này. Có thể copy nội dung `SKILL.md` vào file rule của tool đó (`.cursor/rules/`, `.github/copilot-instructions.md`...).
- Sửa `CLAUDE.md` hoặc skill xong thì phải mở **phiên mới** mới có tác dụng.

## Cập nhật skill từ upstream

Nguồn, commit và license từng skill ghi trong [.claude/skills/SOURCES.md](../.claude/skills/SOURCES.md). Cập nhật:

1. Clone repo gốc ra một thư mục tạm.
2. Đọc qua thay đổi, rồi copy đè `SKILL.md` tương ứng vào `.claude/skills/<tên>/`.
3. Cập nhật commit trong `SOURCES.md`, rồi commit với message kiểu `chore(skills): update ponytail to <commit>`.
