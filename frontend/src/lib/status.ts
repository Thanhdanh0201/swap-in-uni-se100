import type { ListingCondition } from './types'

// Một bảng trạng thái cho cả admin và người dùng (docs/DESIGN.md mục 2). color = màu preset của antd Tag.
type Meta = { label: string; color: string }

export const STATUS = {
  listing: {
    pending: { label: 'Chờ duyệt', color: 'gold' },
    approved: { label: 'Đang bán', color: 'green' },
    rejected: { label: 'Bị từ chối', color: 'red' },
    reserved: { label: 'Đang giao dịch', color: 'blue' },
    sold: { label: 'Đã bán', color: 'default' },
    hidden: { label: 'Đã ẩn', color: 'default' },
  },
  wanted: {
    pending: { label: 'Chờ duyệt', color: 'gold' },
    open: { label: 'Đang tìm', color: 'green' },
    rejected: { label: 'Bị từ chối', color: 'red' },
    closed: { label: 'Đã đóng', color: 'default' },
    hidden: { label: 'Đã ẩn', color: 'default' },
  },
  purchase: {
    pending: { label: 'Chờ phản hồi', color: 'gold' },
    accepted: { label: 'Đã chấp nhận', color: 'blue' },
    rejected: { label: 'Bị từ chối', color: 'red' },
    cancelled: { label: 'Đã hủy', color: 'default' },
    completed: { label: 'Hoàn tất', color: 'green' },
  },
  report: {
    open: { label: 'Mới', color: 'red' },
    resolved: { label: 'Đã xử lý', color: 'green' },
    dismissed: { label: 'Bỏ qua', color: 'default' },
  },
  account: {
    active: { label: 'Hoạt động', color: 'green' },
    locked: { label: 'Bị khóa', color: 'red' },
  },
} satisfies Record<string, Record<string, Meta>>

export type StatusKind = keyof typeof STATUS
export type StatusOf<K extends StatusKind> = keyof (typeof STATUS)[K]

export function statusMeta<K extends StatusKind>(kind: K, status: StatusOf<K>): Meta {
  return (STATUS[kind] as Record<PropertyKey, Meta>)[status]
}

export const CONDITION_LABELS: Record<ListingCondition, string> = {
  new: 'Mới',
  like_new: 'Như mới',
  good: 'Còn tốt',
  fair: 'Đã cũ',
}
