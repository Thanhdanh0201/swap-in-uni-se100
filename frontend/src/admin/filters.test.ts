import { describe, expect, it } from 'vitest'
import { applyFilters, readFilters, type FilterField } from './filters'

const fields: FilterField[] = [
  { name: 'q', label: 'Tìm', type: 'text' },
  { name: 'minPrice', label: 'Giá từ', type: 'number' },
  { name: 'condition', label: 'Tình trạng', type: 'multiSelect', options: [] },
  { name: 'created', label: 'Ngày gửi', type: 'dateRange' },
]

describe('applyFilters', () => {
  it('giữ giá trị 0, nối multiSelect, tách khoảng ngày, về trang 1', () => {
    const next = applyFilters(new URLSearchParams('page=4&status=pending'), fields, {
      q: 'sach',
      minPrice: '0',
      condition: ['new', 'good'],
      created: ['2026-10-01', '2026-10-13'],
    })
    expect(Object.fromEntries(next)).toEqual({
      status: 'pending',
      q: 'sach',
      minPrice: '0',
      condition: 'new,good',
      createdFrom: '2026-10-01',
      createdTo: '2026-10-13',
    })
  })

  it('xoá field rỗng, không đụng tham số ngoài danh sách field', () => {
    const next = applyFilters(new URLSearchParams('q=old&condition=new&id=l7'), fields, { q: '', condition: [] })
    expect(next.toString()).toBe('id=l7')
  })
})

describe('readFilters', () => {
  it('đọc ngược từ URL', () => {
    expect(readFilters(new URLSearchParams('q=a&condition=new,fair&createdFrom=2026-10-01'), fields)).toEqual({
      q: 'a',
      condition: ['new', 'fair'],
      created: ['2026-10-01', ''],
    })
  })
})
