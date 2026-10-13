import { index, layout, route, type RouteConfig } from '@react-router/dev/routes'

// Route public: SSR (loader + meta cho SEO/OG). Route trong app/ và admin/: chỉ render ở client, cần đăng nhập.
// Các trang tính năng hiện trỏ tới ComingSoon; thay dần theo docs/TODO.md.
const dev = process.env.NODE_ENV !== 'production'

const adminPage = (path: string) => route(path, 'app/ComingSoon.tsx', { id: `admin-${path}` })

export default [
  layout('layouts/PublicLayout.tsx', [
    index('pages/public/Home.tsx'),
    route('login', 'pages/public/Login.tsx'),
    route('wanted', 'pages/public/Wanted.tsx'),
    // TODO: route('listings/:id', 'pages/public/ListingDetail.tsx') - SSR + thẻ OG

    layout('app/ClientOnly.tsx', [
      route('sell', 'app/ComingSoon.tsx', { id: 'sell' }),
      route('me/listings', 'app/ComingSoon.tsx', { id: 'my-listings' }),
      route('chat', 'app/ComingSoon.tsx', { id: 'chat' }),
    ]),

    // Xem thử UI kit người dùng (chỉ khi dev).
    ...(dev ? [route('dev/ui', 'pages/dev/UiKit.tsx')] : []),
  ]),

  // Admin CMS: layout riêng, không dùng header/footer của trang người dùng (docs/DESIGN.md mục 2).
  route('admin', 'admin/AdminRoute.tsx', [
    index('app/ComingSoon.tsx', { id: 'admin-home' }),
    ...['moderation', 'reports', 'users', 'categories', 'meeting-points', 'stats'].map(adminPage),
  ]),

  // Xem thử các mẫu trang admin, không cần đăng nhập (chỉ khi dev).
  ...(dev ? [route('dev/admin/*', 'pages/dev/AdminKit.tsx')] : []),
] satisfies RouteConfig
