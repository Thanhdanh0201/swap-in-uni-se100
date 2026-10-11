import { Card, Result } from 'antd'
import { useLocation } from 'react-router'

// Chỗ giữ route cho trang chưa làm. Đăng nhập + Ant Design đã chạy được ở đây.
export default function ComingSoon() {
  const { pathname } = useLocation()
  return (
    <div className="container narrow">
      <Card>
        <Result status="info" title="Đang xây dựng" subTitle={`Trang ${pathname} sẽ làm theo docs/TODO.md.`} />
      </Card>
    </div>
  )
}
