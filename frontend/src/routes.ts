import { index, layout, route, type RouteConfig } from '@react-router/dev/routes'

// Route public: SSR (loader + meta cho SEO/OG). Route trong app/ và admin/: chỉ render ở client, cần đăng nhập.
// Các trang tính năng hiện trỏ tới ComingSoon; thay dần theo docs/TODO.md.
export default [
  layout('layouts/PublicLayout.tsx', [
    index('pages/public/Home.tsx'),
    route('login', 'pages/public/Login.tsx'),
    // TODO: route('listings/:id', 'pages/public/ListingDetail.tsx') - SSR + thẻ OG

    layout('app/ClientOnly.tsx', [
      route('sell', 'app/ComingSoon.tsx', { id: 'sell' }),
      route('me/listings', 'app/ComingSoon.tsx', { id: 'my-listings' }),
      route('chat', 'app/ComingSoon.tsx', { id: 'chat' }),
    ]),

    route('admin', 'admin/AdminRoute.tsx', [index('app/ComingSoon.tsx', { id: 'admin-home' })]),
  ]),
] satisfies RouteConfig
