# SwapInUni – Chợ đồ cũ sinh viên UIT

Tổng quan, tech stack, cấu trúc: @README.md
Việc cần làm: `docs/TODO.md`. Chạy project: `docs/GETTING_STARTED.md`. Migration: `docs/MIGRATIONS.md`. Skill: `docs/SKILLS.md`. Use case: `docs/USE_CASES.md`. Schema đề xuất: `docs/DATABASE.md`. Quyết định: `docs/DECISIONS.md`.
Code backend theo `backend/AGENTS.md`.

## Ngôn ngữ

Trả lời bằng tiếng Việt. Giữ nguyên tiếng Anh cho tên kỹ thuật, code, lệnh, chuỗi lỗi.

## Luôn áp dụng

Hai skill sau bật mặc định cho mọi phiên, không cần gọi lệnh. Tắt bằng "stop caveman" / "stop ponytail" / "normal mode".

- Cách trả lời: @.claude/skills/caveman/SKILL.md
- Cách viết code: @.claude/skills/ponytail/SKILL.md

## Gọi khi cần

- `/caveman-commit`, `/caveman-review`: viết commit message, review PR ngắn gọn.
- `/ponytail-review` (một diff), `/ponytail-audit` (cả repo), `/ponytail-debt`, `/ponytail-help`.
- `/design-taste-frontend`, `/minimalist-ui`, `/redesign-existing-projects`: khi làm hoặc làm lại giao diện. Giữ token màu, font trong `frontend/src/styles/tokens.css` và Ant Design theme ở `frontend/src/theme.ts`.

Nguồn và license các skill: `.claude/skills/SOURCES.md`.
