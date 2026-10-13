import { MagnifyingGlass, WarningCircle } from '@phosphor-icons/react'
import type { ReactNode } from 'react'

// Trạng thái rỗng / lỗi / đang tải dùng chung cho mọi danh sách (DESIGN.md mục 3, nguyên tắc 6).

export function EmptyState({ icon, title, description, action }: { icon?: ReactNode; title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="state" role="status">
      <span className="state__icon">{icon ?? <MagnifyingGlass size={32} aria-hidden />}</span>
      <h3 className="state__title">{title}</h3>
      {description && <p className="muted">{description}</p>}
      {action}
    </div>
  )
}

export function ErrorState({ title = 'Không tải được dữ liệu', description = 'Kiểm tra kết nối mạng rồi thử lại.', action }: { title?: string; description?: string; action?: ReactNode }) {
  return (
    <div className="state" role="alert">
      <span className="state__icon state__icon--danger">
        <WarningCircle size={32} aria-hidden />
      </span>
      <h3 className="state__title">{title}</h3>
      <p className="muted">{description}</p>
      {action ?? (
        <button type="button" className="btn" onClick={() => window.location.reload()}>
          Thử lại
        </button>
      )}
    </div>
  )
}

export function ListingGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="listing-grid" aria-busy="true" aria-label="Đang tải sản phẩm">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="listing-card listing-card--skeleton" aria-hidden>
          <div className="listing-card__img skeleton" />
          <div className="listing-card__body">
            <div className="skeleton skeleton--line" />
            <div className="skeleton skeleton--line skeleton--short" />
            <div className="skeleton skeleton--line skeleton--price" />
          </div>
        </div>
      ))}
    </div>
  )
}
