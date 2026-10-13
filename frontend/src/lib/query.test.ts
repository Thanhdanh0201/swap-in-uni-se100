import { describe, expect, it } from 'vitest'
import { hrefWith, withParam } from './query'

describe('withParam', () => {
  it('đặt giá trị và về trang 1 khi đổi bộ lọc', () => {
    const next = withParam(new URLSearchParams('q=sach&page=3'), 'categoryId', 'c1')
    expect(next.toString()).toBe('q=sach&categoryId=c1')
  })

  it('giữ trang khi chính page đổi', () => {
    expect(withParam(new URLSearchParams('q=sach'), 'page', '2').toString()).toBe('q=sach&page=2')
  })

  it('xoá tham số khi giá trị rỗng', () => {
    expect(withParam(new URLSearchParams('uitOnly=true&q=a'), 'uitOnly', null).toString()).toBe('q=a')
  })
})

describe('hrefWith', () => {
  it('không để dấu ? thừa khi hết tham số', () => {
    expect(hrefWith('/', new URLSearchParams('uitOnly=true'), 'uitOnly', undefined)).toBe('/')
  })
})
