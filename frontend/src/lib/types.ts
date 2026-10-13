// Khớp DTO backend (Business/DTOs), JSON camelCase. Thêm type mới khi làm từng tính năng.

export type Me = {
  id: string
  email: string
  fullName: string
  avatarUrl: string | null
  studentId: string | null
  phone: string | null
  role: 'student' | 'admin'
  isUitVerified: boolean
}

export type ListingStatus = 'pending' | 'approved' | 'rejected' | 'reserved' | 'sold' | 'hidden'
export type ListingCondition = 'new' | 'like_new' | 'good' | 'fair'

export type SellerBrief = {
  id: string
  fullName: string
  avatarUrl: string | null
  isUitVerified: boolean
}

// Thẻ sản phẩm ở danh sách (GET /api/listings).
export type ListingSummary = {
  id: string
  title: string
  price: number
  condition: ListingCondition
  status: ListingStatus
  coverUrl: string | null
  categoryName: string
  createdAt: string
  seller: SellerBrief
}

export type Category = { id: string; name: string; slug: string }

// Trang kết quả (Shared/Responses PagedResult của backend).
export type Paged<T> = { items: T[]; total: number; page: number; pageSize: number }
