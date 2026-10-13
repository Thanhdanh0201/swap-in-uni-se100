import { Eye, PencilSimple, Trash } from '@phosphor-icons/react'
import { Button, Popconfirm, Space, Tooltip } from 'antd'

// Cột "Thao tác" của bảng admin: nút icon nhỏ có Tooltip; Xóa luôn qua Popconfirm.
export function ActionButtons({ onView, onEdit, onDelete, deleteTitle = 'Xóa mục này?' }: { onView?: () => void; onEdit?: () => void; onDelete?: () => void; deleteTitle?: string }) {
  return (
    <Space size={4}>
      {onView && (
        <Tooltip title="Xem">
          <Button size="small" type="text" icon={<Eye size={18} />} onClick={onView} aria-label="Xem" />
        </Tooltip>
      )}
      {onEdit && (
        <Tooltip title="Sửa">
          <Button size="small" type="text" icon={<PencilSimple size={18} />} onClick={onEdit} aria-label="Sửa" />
        </Tooltip>
      )}
      {onDelete && (
        <Popconfirm title={deleteTitle} okText="Xóa" cancelText="Hủy" okButtonProps={{ danger: true }} onConfirm={onDelete}>
          <Tooltip title="Xóa">
            <Button size="small" type="text" danger icon={<Trash size={18} />} aria-label="Xóa" />
          </Tooltip>
        </Popconfirm>
      )}
    </Space>
  )
}
