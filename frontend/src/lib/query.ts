// Đổi một tham số trên query string. Đổi bộ lọc thì về trang 1 (xoá `page`), trừ khi chính `page` đang đổi.
// Giá trị rỗng/undefined = xoá tham số. Dùng cho link bộ lọc (SSR) và useQueryState (client).
export function withParam(params: URLSearchParams, key: string, value?: string | null) {
  const next = new URLSearchParams(params)
  if (value) next.set(key, value)
  else next.delete(key)
  if (key !== 'page') next.delete('page')
  return next
}

export function hrefWith(pathname: string, params: URLSearchParams, key: string, value?: string | null) {
  const qs = withParam(params, key, value).toString()
  return qs ? `${pathname}?${qs}` : pathname
}
