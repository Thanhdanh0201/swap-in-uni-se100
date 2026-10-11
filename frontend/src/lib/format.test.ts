import { describe, expect, it } from 'vitest'
import { formatPrice, timeAgo } from './format'

describe('formatPrice', () => {
  it('hiện Miễn phí khi giá 0', () => {
    expect(formatPrice(0)).toBe('Miễn phí')
  })

  it('định dạng VND không có số lẻ', () => {
    expect(formatPrice(150000).replace(/\s/g, ' ')).toBe('150.000 ₫')
  })
})

describe('timeAgo', () => {
  const now = new Date('2026-10-11T12:00:00Z').getTime()

  it('tính phút, giờ, ngày', () => {
    expect(timeAgo('2026-10-11T11:55:00Z', now)).toBe('5 phút trước')
    expect(timeAgo('2026-10-11T09:00:00Z', now)).toBe('3 giờ trước')
    expect(timeAgo('2026-10-08T12:00:00Z', now)).toBe('3 ngày trước')
  })
})
