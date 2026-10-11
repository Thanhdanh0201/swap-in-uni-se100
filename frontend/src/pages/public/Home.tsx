import { seo } from '../../lib/seo'

export const meta = () => seo()

// TODO: loader gọi GET /api/listings (tìm kiếm/lọc qua query string) và render lưới sản phẩm.
export default function Home() {
  return (
    <div className="container stack">
      <h1>Chợ đồ cũ cho sinh viên UIT</h1>
      <p className="muted">Khung dự án đã chạy. Trang danh sách sản phẩm sẽ nằm ở đây.</p>
    </div>
  )
}
