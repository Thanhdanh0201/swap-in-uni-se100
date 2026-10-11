import type { MetaDescriptor } from 'react-router'

export const SITE_NAME = 'SwapInUni'
const DEFAULT_DESCRIPTION = 'Mua bán, trao đổi đồ cũ giữa sinh viên Trường Đại học Công nghệ Thông tin, ĐHQG-HCM.'

type Seo = { title?: string; description?: string; url?: string; image?: string; type?: 'website' | 'product' }

// Meta của route con thay thế hoàn toàn meta của route cha, nên mỗi route public gọi seo() với đủ thông tin.
// Zalo/Facebook đọc og:*. image và url phải là URL tuyệt đối, công khai.
export function seo({ title, description = DEFAULT_DESCRIPTION, url, image, type = 'website' }: Seo = {}): MetaDescriptor[] {
  return [
    { title: title ? `${title} - ${SITE_NAME}` : SITE_NAME },
    { name: 'description', content: description },
    { property: 'og:site_name', content: SITE_NAME },
    { property: 'og:locale', content: 'vi_VN' },
    { property: 'og:type', content: type },
    { property: 'og:title', content: title ?? SITE_NAME },
    { property: 'og:description', content: description },
    ...(url ? [{ property: 'og:url', content: url }] : []),
    ...(image ? [{ property: 'og:image', content: image }] : []),
  ]
}

export function noIndex(title: string): MetaDescriptor[] {
  return [{ title: `${title} - ${SITE_NAME}` }, { name: 'robots', content: 'noindex' }]
}

export function siteUrl(request: Request) {
  return (process.env.SITE_URL ?? new URL(request.url).origin).replace(/\/$/, '')
}
