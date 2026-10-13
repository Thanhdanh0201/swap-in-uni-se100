import { useCallback } from 'react'
import { useSearchParams } from 'react-router'
import { withParam } from './query'

// Trạng thái lưu trên URL (bộ lọc, trang, `?id=` của Drawer): F5 và Back giữ nguyên (docs/DESIGN.md mục 2).
export function useQueryState(key: string) {
  const [params, setParams] = useSearchParams()
  const set = useCallback(
    (value?: string | null) => setParams((prev) => withParam(prev, key, value), { replace: true }),
    [key, setParams],
  )
  return [params.get(key) ?? undefined, set] as const
}
