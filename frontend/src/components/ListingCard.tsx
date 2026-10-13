import { ImageBroken } from '@phosphor-icons/react'
import { Link } from 'react-router'
import { timeAgo } from '../lib/format'
import { statusMeta } from '../lib/status'
import type { ListingSummary } from '../lib/types'
import { ConditionTag } from './ConditionTag'
import { PriceTag } from './PriceTag'
import { UitBadge } from './UitBadge'

export function ListingCard({ listing }: { listing: ListingSummary }) {
  // Nhãn trên ảnh chỉ cho trạng thái thật ảnh hưởng việc mua (DESIGN.md mục 3).
  const overlay = listing.status === 'reserved' || listing.status === 'sold' ? statusMeta('listing', listing.status).label : null

  return (
    <Link to={`/listings/${listing.id}`} className="listing-card">
      <div className="listing-card__img">
        {listing.coverUrl ? (
          <img src={listing.coverUrl} alt={listing.title} loading="lazy" />
        ) : (
          <ImageBroken size={32} aria-label="Chưa có ảnh" />
        )}
        {overlay && <span className={`listing-card__state listing-card__state--${listing.status}`}>{overlay}</span>}
      </div>
      <div className="listing-card__body">
        <h3 className="listing-card__title">{listing.title}</h3>
        <PriceTag value={listing.price} />
        <div className="listing-card__meta">
          <ConditionTag condition={listing.condition} />
          {/* Giờ server và trình duyệt lệch nhau vài giây: bỏ cảnh báo hydrate cho riêng dòng này. */}
          <span suppressHydrationWarning>{timeAgo(listing.createdAt)}</span>
        </div>
        <div className="listing-card__seller">
          <span>{listing.seller.fullName}</span>
          {listing.seller.isUitVerified && <UitBadge compact />}
        </div>
      </div>
    </Link>
  )
}
