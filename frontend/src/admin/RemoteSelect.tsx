import { Select, Spin, type SelectProps } from 'antd'
import { useEffect, useState } from 'react'

export type RemoteOption = { value: string; label: string }

// Ô chọn tìm từ server (người dùng, danh mục, điểm giao nhận...). Giá trị là id; chờ 400ms sau khi gõ mới gọi API.
// Port ý tưởng BaseAutoComplete của CMS nội bộ, đổi sang Select để form lưu id thay vì nhãn.
// `fetchOptions` phải ổn định (khai báo ngoài component hoặc useCallback).
export function RemoteSelect({
  fetchOptions,
  initialOption,
  ...props
}: { fetchOptions: (keyword: string) => Promise<RemoteOption[]>; initialOption?: RemoteOption } & Omit<SelectProps, 'options' | 'onSearch' | 'showSearch' | 'filterOption'>) {
  const [keyword, setKeyword] = useState('')
  const [result, setResult] = useState<{ keyword: string; options: RemoteOption[] }>()
  const loading = result?.keyword !== keyword

  useEffect(() => {
    let alive = true
    const t = setTimeout(() => {
      fetchOptions(keyword)
        .then((options) => alive && setResult({ keyword, options }))
        .catch(() => alive && setResult({ keyword, options: [] }))
    }, 400)
    return () => {
      alive = false
      clearTimeout(t)
    }
  }, [keyword, fetchOptions])

  const options = result?.options ?? []
  // Giữ nhãn của giá trị đang chọn khi kết quả tìm kiếm không còn chứa nó.
  const withInitial = initialOption && !options.some((o) => o.value === initialOption.value) ? [initialOption, ...options] : options

  return (
    <Select
      {...props}
      showSearch={{ filterOption: false, onSearch: setKeyword }}
      options={withInitial}
      notFoundContent={loading ? <Spin size="small" /> : 'Không có kết quả'}
    />
  )
}
