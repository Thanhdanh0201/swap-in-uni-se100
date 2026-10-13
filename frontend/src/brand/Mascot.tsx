import { Wordmark } from './Logo'

// Mascot "Mượn": ốc mượn hồn, vỏ là mác giá của logo. Chỉ dùng ở trang người dùng, không dùng trong /admin.
// Ảnh WebP động ở public/brand/, render lại bằng docs/brand/make_mascot.py.
// idle: trang rỗng · walk: đang tải · shake: lỗi, 404 · jump: làm xong việc.
export type MascotPose = 'idle' | 'walk' | 'shake' | 'jump'

// Mọi khung cao 300px, chỉ khác bề ngang.
const WIDTH: Record<MascotPose, number> = { idle: 220, walk: 380, shake: 240, jump: 220 }

export function Mascot({ pose = 'idle', size = 112 }: { pose?: MascotPose; size?: number }) {
  return (
    <picture className="mascot">
      {/* Tắt chuyển động: dùng ảnh tĩnh. */}
      <source srcSet="/brand/mascot.webp" media="(prefers-reduced-motion: reduce)" />
      <img src={`/brand/mascot-${pose}.webp`} width={Math.round((WIDTH[pose] * size) / 300)} height={size} alt="" />
    </picture>
  )
}

// Mượn đứng trên chữ SwapInUni: dùng cho màn tải, 404, trang giới thiệu.
export function MascotLockup({ pose = 'idle', size = 140 }: { pose?: MascotPose; size?: number }) {
  return (
    <span className="mascot-lockup">
      <Mascot pose={pose} size={size} />
      <Wordmark />
    </span>
  )
}

// Màn chờ khi trang client-only đang tải JS hoặc đang đọc phiên đăng nhập.
// Hiện sau 300ms (CSS) để lần tải nhanh không bị chớp.
export function BrandLoader({ label = 'Đang tải' }: { label?: string }) {
  return (
    <div className="brand-loader" role="status" aria-label={label}>
      <MascotLockup pose="walk" />
    </div>
  )
}
