import { Outlet } from 'react-router'
import { BrandLoader } from '../brand/Mascot'
import { RequireAuth } from '../lib/auth'
import { noIndex } from '../lib/seo'
import { AntdShell } from './AntdShell'

// Trang cần đăng nhập: chỉ render ở client (không cần SEO, tránh SSR style của Ant Design).
// clientLoader.hydrate làm server trả HydrateFallback, component thật chạy sau khi JS tải.
export async function clientLoader() {
  return null
}
clientLoader.hydrate = true as const

export function HydrateFallback() {
  return <BrandLoader />
}

export const meta = () => noIndex('Tài khoản')

export default function ClientOnly() {
  return (
    <RequireAuth>
      <AntdShell>
        <Outlet />
      </AntdShell>
    </RequireAuth>
  )
}
