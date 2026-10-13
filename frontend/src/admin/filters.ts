// Cấu hình bộ lọc cho FilterPanel (port từ FilterPanel/type.ts của CMS nội bộ, rút gọn cho SwapInUni).
export type FilterOption = { value: string; label: string }

export type FilterField =
  | { name: string; label: string; type: 'text'; placeholder?: string }
  | { name: string; label: string; type: 'number'; placeholder?: string; min?: number }
  | { name: string; label: string; type: 'select' | 'multiSelect'; options: FilterOption[]; placeholder?: string }
  // Lưu thành `${name}From` / `${name}To` (YYYY-MM-DD) trên URL.
  | { name: string; label: string; type: 'dateRange' }

export type FilterValues = Record<string, string | string[] | undefined>

// Giá trị form -> query string. Chỉ bỏ giá trị rỗng (null/undefined/''/[]), giữ 0 và false.
// Mọi thay đổi bộ lọc đưa về trang 1.
export function applyFilters(prev: URLSearchParams, fields: FilterField[], values: FilterValues) {
  const next = new URLSearchParams(prev)
  for (const f of fields) {
    const keys = f.type === 'dateRange' ? [`${f.name}From`, `${f.name}To`] : [f.name]
    keys.forEach((k) => next.delete(k))
    const v = values[f.name]
    if (f.type === 'dateRange') {
      const [from, to] = (v as string[] | undefined) ?? []
      if (from) next.set(`${f.name}From`, from)
      if (to) next.set(`${f.name}To`, to)
    } else if (Array.isArray(v)) {
      if (v.length) next.set(f.name, v.join(','))
    } else if (v != null && v !== '') {
      next.set(f.name, String(v))
    }
  }
  next.delete('page')
  return next
}

// Query string -> giá trị ban đầu của form.
export function readFilters(params: URLSearchParams, fields: FilterField[]): FilterValues {
  const values: FilterValues = {}
  for (const f of fields) {
    if (f.type === 'dateRange') {
      const from = params.get(`${f.name}From`)
      const to = params.get(`${f.name}To`)
      if (from || to) values[f.name] = [from ?? '', to ?? '']
    } else {
      const v = params.get(f.name)
      if (v != null) values[f.name] = f.type === 'multiSelect' ? v.split(',') : v
    }
  }
  return values
}
