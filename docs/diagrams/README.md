# Use case diagram

| File nguồn | Ảnh | Nội dung |
|---|---|---|
| `uc-00-tong-quat.puml` | [png](png/uc-00-tong-quat.png) · [svg](svg/uc-00-tong-quat.svg) | Tổng quát: tác nhân, 26 use case, gói chức năng |
| `uc-01-tai-khoan-tra-cuu.puml` | [png](png/uc-01-tai-khoan-tra-cuu.png) · [svg](svg/uc-01-tai-khoan-tra-cuu.svg) | Phân rã: Tài khoản & tra cứu |
| `uc-02-mua.puml` | [png](png/uc-02-mua.png) · [svg](svg/uc-02-mua.svg) | Phân rã: Mua |
| `uc-03-ban.puml` | [png](png/uc-03-ban.png) · [svg](svg/uc-03-ban.svg) | Phân rã: Bán |
| `uc-04-quan-tri.puml` | [png](png/uc-04-quan-tri.png) · [svg](svg/uc-04-quan-tri.svg) | Phân rã: Quản trị |
| `_style.iuml` | | Style dùng chung (màu xanh UIT, font), được `!include` vào mọi file |

Ý nghĩa từng use case và lý do vẽ như vậy: [../USE_CASES.md](../USE_CASES.md).
Chèn vào Word hoặc slide: ưu tiên bản **SVG** (phóng to không vỡ); Word cũ không nhận SVG thì dùng PNG.

## Sửa và render lại

File dùng `!pragma layout smetana` (bộ dàn bố cục có sẵn trong PlantUML), nên **không cần cài Graphviz**.

**Cách 1: VS Code.** Cài extension *PlantUML* (jebbs.plantuml). Mở file `.puml`, bấm `Alt+D` để xem trước, chọn *Export Current Diagram* để xuất ảnh. Extension cần Java.

**Cách 2: Dòng lệnh.** Cần Java và [plantuml.jar](https://github.com/plantuml/plantuml/releases):

```bash
cd docs/diagrams && java -jar /path/to/plantuml.jar -tpng -charset UTF-8 -o png uc-0*.puml && java -jar /path/to/plantuml.jar -tsvg -charset UTF-8 -o svg uc-0*.puml
```

**Cách 3: Không cài gì.** Dán nội dung file vào https://www.plantuml.com/plantuml (dán cả nội dung `_style.iuml` thay cho dòng `!include`).

## Quy ước

- Mã UC phải khớp bảng ở `USE_CASES.md`. Thêm hoặc đổi use case thì sửa cả hai nơi.
- `include` = luôn xảy ra, mũi tên từ use case gốc tới use case con: `GOC ..> CON : <<include>>`.
- `extend` = có điều kiện, mũi tên từ use case mở rộng về use case gốc. Viết `GOC <.. MORONG : <<extend>>` để use case mở rộng nằm bên phải.
- Không vẽ `«include» Đăng nhập`; đăng nhập là tiền điều kiện, ghi trong đặc tả.
- Bộ dàn `smetana` đặt `note` không đẹp. Quy tắc nghiệp vụ nên ghi trong đặc tả thay vì note, trừ khi note gắn vào use case nằm ở cột ngoài cùng bên phải.
