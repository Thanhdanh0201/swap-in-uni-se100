import type { Category, ListingSummary } from '../../lib/types'

// Dữ liệu giả cho /dev/ui và /dev/admin. Không dùng ở trang thật.
const ago = (hours: number) => new Date(Date.now() - hours * 3600_000).toISOString()
const img = (seed: string) => `https://picsum.photos/seed/swapinuni-${seed}/600/600`

export const MOCK_CATEGORIES: Category[] = [
  { id: 'c1', name: 'Sách & Giáo trình', slug: 'sach-giao-trinh' },
  { id: 'c2', name: 'Đồ điện tử', slug: 'do-dien-tu' },
  { id: 'c3', name: 'Đồ dùng KTX', slug: 'do-dung-ktx' },
  { id: 'c4', name: 'Xe & Phương tiện', slug: 'xe-phuong-tien' },
  { id: 'c5', name: 'Quần áo', slug: 'quan-ao' },
]

const seller = (id: string, fullName: string, isUitVerified: boolean) => ({ id, fullName, avatarUrl: null, isUitVerified })

export const MOCK_LISTINGS: ListingSummary[] = [
  { id: 'l1', title: 'Giáo trình Nhập môn Công nghệ phần mềm, còn mới, có ghi chú bút chì', price: 45000, condition: 'like_new', status: 'approved', coverUrl: img('book'), categoryName: 'Sách & Giáo trình', createdAt: ago(0.4), seller: seller('u1', 'Trần Minh Khoa', true) },
  { id: 'l2', title: 'Máy tính Casio fx-580VN X', price: 320000, condition: 'good', status: 'approved', coverUrl: img('casio'), categoryName: 'Đồ điện tử', createdAt: ago(5), seller: seller('u2', 'Lê Thảo Vy', true) },
  { id: 'l3', title: 'Quạt bàn mini dùng cho phòng KTX khu B', price: 85000, condition: 'fair', status: 'reserved', coverUrl: img('fan'), categoryName: 'Đồ dùng KTX', createdAt: ago(26), seller: seller('u3', 'Nguyễn Hoàng Phúc', false) },
  { id: 'l4', title: 'Xe đạp Asama đi học, đã thay lốp', price: 1150000, condition: 'good', status: 'approved', coverUrl: img('bike'), categoryName: 'Xe & Phương tiện', createdAt: ago(49), seller: seller('u4', 'Phạm Gia Huy', true) },
  { id: 'l5', title: 'Tặng lại bộ đề thi Giải tích 1 các năm', price: 0, condition: 'good', status: 'approved', coverUrl: null, categoryName: 'Sách & Giáo trình', createdAt: ago(72), seller: seller('u5', 'Võ Ngọc Anh', true) },
  { id: 'l6', title: 'Bàn phím cơ Keychron K2 switch nâu', price: 990000, condition: 'like_new', status: 'sold', coverUrl: img('keyboard'), categoryName: 'Đồ điện tử', createdAt: ago(130), seller: seller('u6', 'Đặng Quốc Bảo', false) },
  { id: 'l7', title: 'Áo khoác đồng phục UIT size M', price: 120000, condition: 'new', status: 'pending', coverUrl: img('jacket'), categoryName: 'Quần áo', createdAt: ago(2), seller: seller('u7', 'Huỳnh Thị Mai', true) },
  { id: 'l8', title: 'Nồi cơm điện 0.6L', price: 150000, condition: 'fair', status: 'pending', coverUrl: img('ricecooker'), categoryName: 'Đồ dùng KTX', createdAt: ago(8), seller: seller('u8', 'Bùi Tấn Lộc', false) },
]

export const MOCK_GALLERY = ['book', 'book-2', 'book-3', 'book-4'].map(img)

export type MeetingPoint = { id: string; name: string; description: string; suggestedHours: string; isActive: boolean }

let points: MeetingPoint[] = [
  { id: 'm1', name: 'Thư viện - sảnh tầng 1', description: 'Cạnh quầy gửi đồ, có camera', suggestedHours: '7h30 - 20h', isActive: true },
  { id: 'm2', name: 'Căng tin khu A', description: 'Bàn gần cửa ra bãi xe', suggestedHours: '10h - 14h', isActive: true },
  { id: 'm3', name: 'Sảnh tòa B', description: 'Trước phòng bảo vệ', suggestedHours: '7h - 21h', isActive: true },
  { id: 'm4', name: 'Cổng KTX khu B', description: 'Đang sửa, tạm không dùng', suggestedHours: '17h - 21h', isActive: false },
]

// Service giả cho CrudPage: lưu trong bộ nhớ, trễ 300ms cho giống gọi API.
const wait = () => new Promise((r) => setTimeout(r, 300))
export const mockMeetingPointService = {
  async list({ page, pageSize, keyword }: { page: number; pageSize: number; keyword?: string }) {
    await wait()
    const all = keyword ? points.filter((p) => p.name.toLowerCase().includes(keyword.toLowerCase())) : points
    return { items: all.slice((page - 1) * pageSize, page * pageSize), total: all.length, page, pageSize }
  },
  async create(values: Partial<MeetingPoint>) {
    await wait()
    points = [...points, { id: `m${Date.now()}`, name: '', description: '', suggestedHours: '', isActive: true, ...values }]
  },
  async update(id: string, values: Partial<MeetingPoint>) {
    await wait()
    points = points.map((p) => (p.id === id ? { ...p, ...values } : p))
  },
  async remove(id: string) {
    await wait()
    points = points.filter((p) => p.id !== id)
  },
}
