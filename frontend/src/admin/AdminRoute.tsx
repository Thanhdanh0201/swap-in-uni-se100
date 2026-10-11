import { Outlet } from 'react-router'
import { AntdShell } from '../app/AntdShell'
import { RequireAuth } from '../lib/auth'
import { noIndex } from '../lib/seo'

export async function clientLoader() {
  return null
}
clientLoader.hydrate = true as const

export function HydrateFallback() {
  return <p className="container muted">Đang tải trang quản trị...</p>
}

export const meta = () => noIndex('Kiểm duyệt')

// Chặn ở UI cho gọn; quyền thật do backend kiểm tra ([Authorize(Roles = "admin")]).
export default function AdminRoute() {
  return (
    <RequireAuth roles={['admin']}>
      <AntdShell>
        <Outlet />
      </AntdShell>
    </RequireAuth>
  )
}
