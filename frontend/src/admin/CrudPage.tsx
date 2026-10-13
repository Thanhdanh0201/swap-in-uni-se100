import { MagnifyingGlass, PencilSimple, Plus, Trash } from '@phosphor-icons/react'
import { App, Button, Drawer, Flex, Form, Input, Popconfirm, Space, Table, Tooltip, type TableColumnsType } from 'antd'
import { useEffect, useState, type ReactNode } from 'react'
import type { Paged } from '../lib/types'
import { useQueryState } from '../lib/useQueryState'
import { AdminPage } from './AdminPage'

export type CrudService<T> = {
  list: (query: { page: number; pageSize: number; keyword?: string }) => Promise<Paged<T>>
  create: (values: Partial<T>) => Promise<unknown>
  update: (id: string, values: Partial<T>) => Promise<unknown>
  remove?: (id: string) => Promise<unknown>
}

const PAGE_SIZE = 20

// Mẫu trang CRUD cho danh mục dạng bảng (Danh mục, Điểm giao nhận...): tìm kiếm + bảng + Drawer form tạo/sửa + xóa có xác nhận.
// Port từ mẫu BaseCrudPage của CMS nội bộ nhóm từng làm, đổi sang api() + message của antd, không react-query/toastify.
// Tìm kiếm và trang nằm trên URL (DESIGN.md mục 2).
export function CrudPage<T extends { id: string }>({
  title,
  service,
  columns,
  form: formItems,
  initialValues,
}: {
  title: string
  service: CrudService<T>
  columns: TableColumnsType<T>
  form: ReactNode
  initialValues?: Partial<T>
}) {
  const { message } = App.useApp()
  const [keyword, setKeyword] = useQueryState('keyword')
  const [pageParam, setPage] = useQueryState('page')
  const page = Number(pageParam) || 1

  // Kết quả gắn với khoá truy vấn: đang tải = chưa có kết quả cho khoá hiện tại (không setState đồng bộ trong effect).
  const [version, setVersion] = useState(0)
  const queryKey = `${page}|${keyword ?? ''}|${version}`
  const [result, setResult] = useState<{ key: string; data?: Paged<T> }>()
  const data = result?.data
  const loading = result?.key !== queryKey
  const [editing, setEditing] = useState<T | 'new'>()
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState<string>()

  useEffect(() => {
    let alive = true
    service
      .list({ page, pageSize: PAGE_SIZE, keyword })
      .then((d) => alive && setResult({ key: queryKey, data: d }))
      .catch((e: Error) => {
        if (!alive) return
        message.error(e.message || 'Không tải được dữ liệu.')
        setResult((r) => ({ key: queryKey, data: r?.data }))
      })
    return () => {
      alive = false
    }
  }, [service, page, keyword, queryKey, message])

  const load = () => setVersion((v) => v + 1)

  async function save(values: Partial<T>) {
    setSaving(true)
    try {
      if (editing === 'new') await service.create(values)
      else if (editing) await service.update(editing.id, values)
      message.success('Đã lưu.')
      setEditing(undefined)
      load()
    } catch (e) {
      message.error(e instanceof Error ? e.message : 'Lưu thất bại.')
    } finally {
      setSaving(false)
    }
  }

  async function remove(id: string) {
    setDeletingId(id)
    try {
      await service.remove!(id)
      message.success('Đã xóa.')
      load()
    } catch (e) {
      message.error(e instanceof Error ? e.message : 'Xóa thất bại.')
    } finally {
      setDeletingId(undefined)
    }
  }

  return (
    <AdminPage
      title={title}
      extra={
        <Space wrap>
          <Input.Search
            placeholder="Tìm theo tên"
            allowClear
            defaultValue={keyword}
            enterButton={<MagnifyingGlass size={16} aria-label="Tìm" />}
            onSearch={(v) => setKeyword(v.trim() || null)}
            style={{ width: 240 }}
          />
          <Button type="primary" icon={<Plus size={16} />} onClick={() => setEditing('new')}>
            Thêm
          </Button>
        </Space>
      }
    >
      <Table<T>
        rowKey="id"
        bordered
        size="middle"
        loading={loading}
        dataSource={data?.items}
        scroll={{ x: 720 }}
        pagination={{ current: page, pageSize: PAGE_SIZE, total: data?.total, showSizeChanger: false, hideOnSinglePage: true, onChange: (p) => setPage(String(p)) }}
        columns={[
          ...columns,
          {
            title: 'Thao tác',
            key: 'action',
            width: 120,
            align: 'center',
            fixed: 'right',
            render: (_, record) => (
              <Space size={4}>
                <Tooltip title="Sửa">
                  <Button size="small" type="text" icon={<PencilSimple size={18} />} onClick={() => setEditing(record)} aria-label="Sửa" />
                </Tooltip>
                {service.remove && (
                  <Popconfirm title="Xóa mục này?" okText="Xóa" cancelText="Hủy" okButtonProps={{ danger: true }} onConfirm={() => remove(record.id)}>
                    <Tooltip title="Xóa">
                      <Button size="small" type="text" danger loading={deletingId === record.id} icon={<Trash size={18} />} aria-label="Xóa" />
                    </Tooltip>
                  </Popconfirm>
                )}
              </Space>
            ),
          },
        ]}
      />

      <Drawer
        open={!!editing}
        onClose={() => setEditing(undefined)}
        title={editing === 'new' ? `Thêm ${title.toLowerCase()}` : 'Sửa'}
        size="min(560px, 100vw)"
        destroyOnHidden
        footer={
          <Flex justify="end" gap={8}>
            <Button onClick={() => setEditing(undefined)}>Hủy</Button>
            <Button type="primary" loading={saving} htmlType="submit" form="crud-form">
              Lưu
            </Button>
          </Flex>
        }
      >
        {/* Không giữ instance form giữa các lần mở: key mới = store mới, nhận đúng giá trị của bản ghi đang sửa.
            Nút Lưu ở footer submit qua thuộc tính HTML form="crud-form". */}
        <Form
          key={editing === 'new' ? 'new' : editing?.id}
          name="crud-form"
          layout="vertical"
          initialValues={editing === 'new' ? initialValues : editing}
          onFinish={save}
          disabled={saving}
        >
          {formItems}
        </Form>
      </Drawer>
    </AdminPage>
  )
}
