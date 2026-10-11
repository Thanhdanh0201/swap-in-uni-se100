import type { Config } from '@react-router/dev/config'

// SSR để trang public (danh sách, chi tiết sản phẩm) có HTML và thẻ OG ngay khi tải: share link Zalo/Facebook có ảnh + giá.
// Trang cần đăng nhập (/sell, /me, /chat, /admin) chỉ render ở client (xem src/app/ClientOnly.tsx).
export default {
  appDirectory: 'src',
  ssr: true,
} satisfies Config
