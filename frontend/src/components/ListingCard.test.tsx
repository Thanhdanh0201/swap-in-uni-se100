// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { afterEach, describe, expect, it } from 'vitest'
import type { ListingSummary } from '../lib/types'
import { ListingCard } from './ListingCard'

const base: ListingSummary = {
  id: 'l1',
  title: 'Máy tính Casio',
  price: 0,
  condition: 'good',
  status: 'approved',
  coverUrl: null,
  categoryName: 'Đồ điện tử',
  createdAt: new Date().toISOString(),
  seller: { id: 'u1', fullName: 'Lê Thảo Vy', avatarUrl: null, isUitVerified: true },
}

const renderCard = (patch: Partial<ListingSummary>) =>
  render(
    <MemoryRouter>
      <ListingCard listing={{ ...base, ...patch }} />
    </MemoryRouter>,
  )

afterEach(cleanup)

describe('ListingCard', () => {
  it('hiện Miễn phí, tình trạng, huy hiệu UIT và link tới chi tiết', () => {
    renderCard({})
    expect(screen.getByText('Miễn phí')).toBeTruthy()
    expect(screen.getByText('Còn tốt')).toBeTruthy()
    expect(screen.getByText('Đã xác thực UIT')).toBeTruthy()
    expect(screen.getByRole('link').getAttribute('href')).toBe('/listings/l1')
  })

  it('chỉ đè nhãn lên ảnh khi đang giao dịch hoặc đã bán', () => {
    renderCard({ status: 'sold' })
    expect(screen.getByText('Đã bán')).toBeTruthy()
    cleanup()
    renderCard({ status: 'approved', seller: { ...base.seller, isUitVerified: false } })
    expect(screen.queryByText('Đang bán')).toBeNull()
    expect(screen.queryByText('Đã xác thực UIT')).toBeNull()
  })
})
