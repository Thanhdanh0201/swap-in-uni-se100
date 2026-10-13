import type { ReactNode } from 'react'
import { isRouteErrorResponse, Links, Meta, Outlet, Scripts, ScrollRestoration } from 'react-router'
import type { Route } from './+types/root'
import '@fontsource/be-vietnam-pro/400.css'
import '@fontsource/be-vietnam-pro/500.css'
import '@fontsource/be-vietnam-pro/600.css'
import '@fontsource/be-vietnam-pro/700.css'
import './styles/tokens.css'
import './styles/base.css'
import './styles/app.css'
import './styles/brand.css'
import { Mascot } from './brand/Mascot'
import { AuthProvider } from './lib/auth'
import { seo } from './lib/seo'

export const meta: Route.MetaFunction = () => seo()

export function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="vi">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <Meta />
        <Links />
      </head>
      <body>
        <div id="root">{children}</div>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default function Root() {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  )
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  const notFound = isRouteErrorResponse(error) && error.status === 404
  return (
    <main className="container stack" style={{ paddingBlock: 'var(--space-7)' }}>
      <Mascot pose="shake" />
      <h1>{notFound ? 'Không tìm thấy trang' : 'Đã có lỗi xảy ra'}</h1>
      <p className="muted">{notFound ? 'Trang hoặc bài đăng không tồn tại, hoặc đã bị gỡ.' : 'Vui lòng tải lại trang hoặc thử lại sau.'}</p>
      <p><a href="/">Về trang chủ</a></p>
    </main>
  )
}
