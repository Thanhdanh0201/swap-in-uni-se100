import { Card } from 'antd'
import type { ReactNode } from 'react'

// Mẫu trang danh sách admin: một Card, bộ lọc gọn + nút chính ở `extra`.
// Bộ lọc nhiều hơn 3 trường thì đưa vào `filters` (lưới tự xuống dòng phía trên nội dung).
export function AdminPage({ title, extra, filters, children }: { title: ReactNode; extra?: ReactNode; filters?: ReactNode; children: ReactNode }) {
  return (
    <Card title={title} extra={extra} className="admin-page">
      {filters && <div className="admin-page__filters">{filters}</div>}
      {children}
    </Card>
  )
}
