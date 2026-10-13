import { Drawer, Flex } from 'antd'
import type { ReactNode } from 'react'
import { useQueryState } from '../lib/useQueryState'

// Chi tiết bản ghi trong Drawer, mở bằng `?id=` trên URL để F5 / gửi link vẫn mở đúng (DESIGN.md mục 2).
// Mở: gọi set id của useQueryState('id') từ bảng; đóng: xoá `id`.
export function DetailDrawer({ title, footer, children }: { title: (id: string) => ReactNode; footer?: (id: string) => ReactNode; children: (id: string) => ReactNode }) {
  const [id, setId] = useQueryState('id')
  return (
    <Drawer
      open={!!id}
      onClose={() => setId(null)}
      title={id && title(id)}
      size="min(840px, 100vw)"
      destroyOnHidden
      footer={id && footer && <Flex justify="end" gap={8}>{footer(id)}</Flex>}
    >
      {id && children(id)}
    </Drawer>
  )
}
