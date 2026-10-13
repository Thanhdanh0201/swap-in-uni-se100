import { ChatCircleDots } from '@phosphor-icons/react'
import type { UploadFile } from 'antd'
import { useState } from 'react'
import { Link } from 'react-router'
import { AntdShell } from '../../app/AntdShell'
import { ConditionTag } from '../../components/ConditionTag'
import { FilterBar } from '../../components/FilterBar'
import { ImageGallery } from '../../components/ImageGallery'
import { ImageUploader } from '../../components/ImageUploader'
import { ListingCard } from '../../components/ListingCard'
import { PriceTag } from '../../components/PriceTag'
import { EmptyState, ErrorState, ListingGridSkeleton } from '../../components/States'
import { StatusTag } from '../../components/StatusTag'
import { UitBadge } from '../../components/UitBadge'
import { noIndex } from '../../lib/seo'
import { STATUS, type StatusKind, type StatusOf } from '../../lib/status'
import type { ListingCondition } from '../../lib/types'
import { MOCK_CATEGORIES, MOCK_GALLERY, MOCK_LISTINGS } from './mock'

// Trang xem thử UI kit người dùng (docs/DESIGN.md mục 4). Chỉ có khi dev. Xem ở 375px và 1280px.
export async function clientLoader() {
  return null
}
clientLoader.hydrate = true as const

export function HydrateFallback() {
  return <p className="container muted">Đang tải...</p>
}

export const meta = () => noIndex('UI kit')

export default function UiKit() {
  const [files, setFiles] = useState<UploadFile[]>([])
  const publicListings = MOCK_LISTINGS.filter((l) => l.status !== 'pending')
  return (
    <AntdShell>
      <div className="container kit">
        <h1>UI kit người dùng</h1>

        <section className="kit__section">
          <h2>Trang chủ: bộ lọc + lưới sản phẩm</h2>
          <div className="kit__layout">
            <FilterBar categories={MOCK_CATEGORIES} />
            <div className="listing-grid">
              {publicListings.map((l) => (
                <ListingCard key={l.id} listing={l} />
              ))}
            </div>
          </div>
        </section>

        <section className="kit__section">
          <h2>Giá, tình trạng, huy hiệu</h2>
          <div className="kit__row">
            <PriceTag value={1150000} />
            <PriceTag value={0} />
            <PriceTag value={320000} size="lg" />
          </div>
          <div className="kit__row">
            {(['new', 'like_new', 'good', 'fair'] as ListingCondition[]).map((c) => (
              <ConditionTag key={c} condition={c} />
            ))}
            <UitBadge />
            <span>
              Trần Minh Khoa <UitBadge compact />
            </span>
          </div>
        </section>

        <section className="kit__section">
          <h2>StatusTag (dùng chung với admin)</h2>
          {(Object.keys(STATUS) as StatusKind[]).map((kind) => (
            <div key={kind} className="kit__row">
              <strong style={{ width: 96 }}>{kind}</strong>
              {(Object.keys(STATUS[kind]) as StatusOf<typeof kind>[]).map((s) => (
                <StatusTag key={String(s)} kind={kind} status={s} />
              ))}
            </div>
          ))}
        </section>

        <section className="kit__section">
          <h2>Gallery ảnh</h2>
          <div style={{ maxWidth: 480 }}>
            <ImageGallery images={MOCK_GALLERY} title="Giáo trình Nhập môn CNPM" />
          </div>
          <div style={{ maxWidth: 240 }}>
            <ImageGallery images={[]} title="Không có ảnh" />
          </div>
        </section>

        <section className="kit__section">
          <h2>Chọn ảnh khi đăng bán (ImageUploader)</h2>
          <p className="muted">JPG/PNG/WebP, tối đa 5 MB, 6 ảnh. Bấm ảnh để xem trước.</p>
          <ImageUploader value={files} onChange={setFiles} />
        </section>

        <section className="kit__section">
          <h2>Trạng thái</h2>
          <ListingGridSkeleton count={4} />
          <EmptyState
            title="Chưa có sản phẩm phù hợp"
            description="Thử bỏ bớt bộ lọc, hoặc đăng tin cần mua để người bán tìm bạn."
            action={
              <Link to="/wanted" className="btn btn--primary">
                Đăng tin cần mua
              </Link>
            }
          />
          <EmptyState icon={<ChatCircleDots size={32} aria-hidden />} title="Chưa có tin nhắn" description="Bấm Nhắn tin ở trang sản phẩm để hỏi người bán." />
          <ErrorState />
        </section>
      </div>
    </AntdShell>
  )
}
