import { MegaphoneSimple } from '@phosphor-icons/react'
import { EmptyState } from '../../components/States'
import { seo } from '../../lib/seo'

export const meta = () => seo({ title: 'Tin cần mua' })

// TODO SCRUM-40: loader GET /api/wanted, danh sách tin cần mua.
export default function Wanted() {
  return (
    <div className="container stack">
      <h1>Tin cần mua</h1>
      <EmptyState icon={<MegaphoneSimple size={32} aria-hidden />} title="Chưa có tin cần mua" description="Tính năng đang được xây dựng." />
    </div>
  )
}
