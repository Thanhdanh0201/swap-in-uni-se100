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
