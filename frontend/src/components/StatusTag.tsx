import { Tag } from 'antd'
import { statusMeta, type StatusKind, type StatusOf } from '../lib/status'

// Ant Design Tag: chỉ dùng ở trang client-only (admin, bài của tôi).
export function StatusTag<K extends StatusKind>({ kind, status }: { kind: K; status: StatusOf<K> }) {
  const { label, color } = statusMeta(kind, status)
  return <Tag color={color}>{label}</Tag>
}
