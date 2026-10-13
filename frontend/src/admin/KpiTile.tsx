import { Card, Statistic } from 'antd'
import type { ReactNode } from 'react'

// Ô KPI trang Tổng quan. value lấy từ API thật (UC26), không điền số giả.
export function KpiTile({ title, value, icon, suffix, loading }: { title: string; value?: number; icon: ReactNode; suffix?: string; loading?: boolean }) {
  return (
    <Card className="kpi-tile" loading={loading}>
      <span className="kpi-tile__icon">{icon}</span>
      <Statistic title={title} value={value ?? '-'} suffix={suffix} />
    </Card>
  )
}
