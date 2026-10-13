import { SealCheck } from '@phosphor-icons/react'

// Huy hiệu tài khoản email trường (ADR-005). compact: chỉ icon, dùng cạnh tên trên thẻ nhỏ.
export function UitBadge({ compact = false }: { compact?: boolean }) {
  return (
    <span className="uit-badge" title="Đã xác thực email trường UIT">
      <SealCheck size={compact ? 16 : 18} weight="fill" aria-hidden />
      {compact ? <span className="visually-hidden">Đã xác thực UIT</span> : 'UIT'}
    </span>
  )
}
