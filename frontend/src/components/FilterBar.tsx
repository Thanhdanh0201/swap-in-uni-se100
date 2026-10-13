import { Funnel, SealCheck, X } from '@phosphor-icons/react'
import { useRef } from 'react'
import { Form, Link, useLocation, useSearchParams } from 'react-router'
import { hrefWith } from '../lib/query'
import { CONDITION_LABELS } from '../lib/status'
import type { Category } from '../lib/types'

// Bộ lọc trang chủ. Desktop: cột trái. Mobile: hàng chip cuộn ngang + nút "Lọc" mở bottom sheet (<dialog>).
// Mọi bộ lọc là query string (GET form / link), chạy được cả khi chưa tải JS.
export function FilterBar({ categories }: { categories: Category[] }) {
  const [params] = useSearchParams()
  const { pathname } = useLocation()
  const sheet = useRef<HTMLDialogElement>(null)
  const categoryId = params.get('categoryId')
  const uitOnly = params.get('uitOnly') === 'true'

  return (
    <>
      <aside className="filter-panel" aria-label="Bộ lọc">
        <FilterFields categories={categories} params={params} />
      </aside>

      <div className="filter-chips" aria-label="Lọc nhanh">
        <button type="button" className="chip chip--action" onClick={() => sheet.current?.showModal()}>
          <Funnel size={16} aria-hidden /> Lọc
        </button>
        <Link to={hrefWith(pathname, params, 'uitOnly', uitOnly ? null : 'true')} className={`chip chip--action${uitOnly ? ' is-on' : ''}`} aria-pressed={uitOnly}>
          <SealCheck size={16} aria-hidden /> Người bán UIT
        </Link>
        {categories.map((c) => (
          <Link key={c.id} to={hrefWith(pathname, params, 'categoryId', categoryId === c.id ? null : c.id)} className={`chip chip--action${categoryId === c.id ? ' is-on' : ''}`} aria-pressed={categoryId === c.id}>
            {c.name}
          </Link>
        ))}
      </div>

      <dialog ref={sheet} className="sheet" aria-label="Bộ lọc">
        <div className="sheet__head">
          <h2>Bộ lọc</h2>
          <button type="button" className="icon-link" onClick={() => sheet.current?.close()} aria-label="Đóng">
            <X size={20} />
          </button>
        </div>
        <FilterFields categories={categories} params={params} onSubmit={() => sheet.current?.close()} />
      </dialog>
    </>
  )
}

function FilterFields({ categories, params, onSubmit }: { categories: Category[]; params: URLSearchParams; onSubmit?: () => void }) {
  return (
    <Form method="get" className="stack" onSubmit={onSubmit}>
      {params.get('q') && <input type="hidden" name="q" value={params.get('q')!} />}
      <label className="field">
        <span>Danh mục</span>
        <select name="categoryId" defaultValue={params.get('categoryId') ?? ''}>
          <option value="">Tất cả</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </label>
      <label className="field">
        <span>Tình trạng</span>
        <select name="condition" defaultValue={params.get('condition') ?? ''}>
          <option value="">Tất cả</option>
          {Object.entries(CONDITION_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </label>
      <div className="field">
        <span>Giá (đ)</span>
        <div className="price-range">
          <input name="minPrice" type="number" inputMode="numeric" min={0} step={1000} placeholder="Từ" defaultValue={params.get('minPrice') ?? ''} aria-label="Giá từ" />
          <input name="maxPrice" type="number" inputMode="numeric" min={0} step={1000} placeholder="Đến" defaultValue={params.get('maxPrice') ?? ''} aria-label="Giá đến" />
        </div>
      </div>
      <label className="field">
        <span>Sắp xếp</span>
        <select name="sort" defaultValue={params.get('sort') ?? 'newest'}>
          <option value="newest">Mới nhất</option>
          <option value="price_asc">Giá thấp đến cao</option>
          <option value="price_desc">Giá cao đến thấp</option>
        </select>
      </label>
      <label className="check">
        <input type="checkbox" name="uitOnly" value="true" defaultChecked={params.get('uitOnly') === 'true'} />
        Chỉ người bán đã xác thực UIT
      </label>
      <button type="submit" className="btn btn--primary">
        Áp dụng
      </button>
      {/* Giữ từ khóa tìm kiếm, bỏ mọi bộ lọc khác. */}
      <Link to={params.get('q') ? `?q=${encodeURIComponent(params.get('q')!)}` : '?'} className="btn">
        Xóa bộ lọc
      </Link>
    </Form>
  )
}
