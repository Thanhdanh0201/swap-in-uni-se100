import { AntdShell } from '../app/AntdShell'
import { BrandLoader } from '../brand/Mascot'
import { RequireAuth } from '../lib/auth'
import { noIndex } from '../lib/seo'
import { AdminLayout } from './AdminLayout'

export async function clientLoader() {
  return null
}
clientLoader.hydrate = true as const

export function HydrateFallback() {
  return <BrandLoader />
}

export const meta = () => noIndex('Quản trị')

// Chặn ở UI cho gọn; quyền thật do backend kiểm tra ([Authorize(Roles = "admin")]).
export default function AdminRoute() {
  return (
    <RequireAuth roles={['admin']}>
      <AntdShell>
        <AdminLayout />
      </AntdShell>
    </RequireAuth>
  )
}
