import { CheckCircle, Flag, ListChecks, Plus, Users } from '@phosphor-icons/react'
import { App, Button, Col, Descriptions, Form, Image, Input, Modal, Row, Segmented, Select, Space, Table } from 'antd'
import { useState } from 'react'
import { ActionButtons } from '../../admin/ActionButtons'
import { AdminLayout } from '../../admin/AdminLayout'
import { AdminPage } from '../../admin/AdminPage'
import { DetailDrawer } from '../../admin/DetailDrawer'
import { KpiTile } from '../../admin/KpiTile'
import { AntdShell } from '../../app/AntdShell'
import { PriceTag } from '../../components/PriceTag'
import { StatusTag } from '../../components/StatusTag'
import { UitBadge } from '../../components/UitBadge'
import { formatDateTime } from '../../lib/format'
import { noIndex } from '../../lib/seo'
import { CONDITION_LABELS, STATUS } from '../../lib/status'
import type { ListingStatus, ListingSummary } from '../../lib/types'
import { useQueryState } from '../../lib/useQueryState'
import { MOCK_CATEGORIES, MOCK_GALLERY, MOCK_LISTINGS } from './mock'

// Xem thử các mẫu trang Admin CMS (docs/DESIGN.md mục 2) với dữ liệu giả. Chỉ có khi dev, không cần đăng nhập.
export async function clientLoader() {
  return null
}
clientLoader.hydrate = true as const

export function HydrateFallback() {
  return <p className="container muted">Đang tải...</p>
}

export const meta = () => noIndex('Admin kit')

export default function AdminKit() {
  return (
    <AntdShell>
      <AdminLayout base="/dev/admin">
        <Space orientation="vertical" size={16} style={{ width: '100%' }}>
          <Kpis />
          <ModerationDemo />
        </Space>
      </AdminLayout>
    </AntdShell>
  )
}

function Kpis() {
  // Số ở đây là dữ liệu mẫu; trang thật lấy từ API thống kê (UC26).
  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} sm={12} lg={6}>
        <KpiTile title="Chờ duyệt (mẫu)" value={2} icon={<ListChecks size={24} />} />
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <KpiTile title="Báo cáo mới (mẫu)" value={1} icon={<Flag size={24} />} />
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <KpiTile title="Giao dịch hoàn tất (mẫu)" value={1} icon={<CheckCircle size={24} />} />
      </Col>
      <Col xs={24} sm={12} lg={6}>
        <KpiTile title="Thành viên (mẫu)" value={8} icon={<Users size={24} />} />
      </Col>
    </Row>
  )
}

function ModerationDemo() {
  const { message } = App.useApp()
  const [q, setQ] = useQueryState('q')
  const [status = 'pending', setStatus] = useQueryState('status')
  const [, setId] = useQueryState('id')
  const [rejecting, setRejecting] = useState<ListingSummary>()
  const [creating, setCreating] = useState(false)
  const [form] = Form.useForm()

  const rows = MOCK_LISTINGS.filter((l) => l.status === status && (!q || l.title.toLowerCase().includes(q.toLowerCase())))
  const find = (id: string) => MOCK_LISTINGS.find((l) => l.id === id)

  return (
    <AdminPage
      title="Kiểm duyệt bài đăng"
      extra={
        <Space wrap>
          <Input.Search placeholder="Tìm theo tên" allowClear defaultValue={q} onSearch={(v) => setQ(v)} style={{ width: 220 }} />
          <Segmented<ListingStatus>
            value={status as ListingStatus}
            onChange={(v) => setStatus(v)}
            options={(['pending', 'approved', 'rejected', 'hidden'] as const).map((s) => ({ value: s, label: STATUS.listing[s].label }))}
          />
          <Button type="primary" icon={<Plus size={16} />} onClick={() => setCreating(true)}>
            Thêm danh mục
          </Button>
        </Space>
      }
    >
      <Table<ListingSummary>
        rowKey="id"
        bordered
        size="middle"
        dataSource={rows}
        scroll={{ x: 900 }}
        pagination={{ pageSize: 20, hideOnSinglePage: true }}
        columns={[
          { title: 'Ảnh', dataIndex: 'coverUrl', width: 72, render: (src: string | null, l) => (src ? <Image src={src} alt={l.title} width={48} height={48} style={{ objectFit: 'cover', borderRadius: 8 }} /> : '-') },
          { title: 'Tiêu đề', dataIndex: 'title', ellipsis: true },
          { title: 'Người bán', width: 200, render: (_, l) => <Space size={4}>{l.seller.fullName}{l.seller.isUitVerified && <UitBadge compact />}</Space> },
          { title: 'Giá', dataIndex: 'price', width: 130, render: (v: number) => <PriceTag value={v} /> },
          { title: 'Trạng thái', dataIndex: 'status', width: 140, render: (s: ListingStatus) => <StatusTag kind="listing" status={s} /> },
          { title: 'Gửi lúc', dataIndex: 'createdAt', width: 150, render: formatDateTime },
          { title: 'Thao tác', width: 120, fixed: 'right', align: 'center', render: (_, l) => <ActionButtons onView={() => setId(l.id)} onDelete={() => message.success(`Đã xóa "${l.title}" (mẫu)`)} /> },
        ]}
      />

      <DetailDrawer
        title={(id) => (
          <Space>
            {find(id)?.title}
            {find(id) && <StatusTag kind="listing" status={find(id)!.status} />}
          </Space>
        )}
        footer={(id) =>
          find(id)?.status === 'pending' && (
            <>
              <Button danger onClick={() => setRejecting(find(id))}>
                Từ chối
              </Button>
              <Button
                type="primary"
                onClick={() => {
                  message.success('Đã duyệt bài (mẫu)')
                  setId(null)
                }}
              >
                Duyệt
              </Button>
            </>
          )
        }
      >
        {(id) => {
          const l = find(id)
          if (!l) return <p className="muted">Không tìm thấy bài.</p>
          return (
            <Space orientation="vertical" size={16} style={{ width: '100%' }}>
              <Image.PreviewGroup>
                <Space wrap>
                  {MOCK_GALLERY.map((src) => (
                    <Image key={src} src={src} alt={l.title} width={120} height={120} style={{ objectFit: 'cover', borderRadius: 12 }} />
                  ))}
                </Space>
              </Image.PreviewGroup>
              <Descriptions bordered column={1} size="small">
                <Descriptions.Item label="Giá">
                  <PriceTag value={l.price} />
                </Descriptions.Item>
                <Descriptions.Item label="Tình trạng">{CONDITION_LABELS[l.condition]}</Descriptions.Item>
                <Descriptions.Item label="Danh mục">{l.categoryName}</Descriptions.Item>
                <Descriptions.Item label="Người bán">
                  <Space size={4}>
                    {l.seller.fullName}
                    {l.seller.isUitVerified && <UitBadge />}
                  </Space>
                </Descriptions.Item>
                <Descriptions.Item label="Gửi lúc">{formatDateTime(l.createdAt)}</Descriptions.Item>
              </Descriptions>
            </Space>
          )
        }}
      </DetailDrawer>

      <RejectModal
        listing={rejecting}
        onClose={() => setRejecting(undefined)}
        onDone={() => {
          message.success('Đã từ chối bài (mẫu)')
          setRejecting(undefined)
          setId(null)
        }}
      />

      <Modal
        open={creating}
        title="Thêm danh mục"
        okText="Lưu"
        cancelText="Hủy"
        onCancel={() => setCreating(false)}
        onOk={() =>
          form.validateFields().then(() => {
            message.success('Đã lưu (mẫu)')
            form.resetFields()
            setCreating(false)
          })
        }
      >
        <Form form={form} layout="vertical">
          <Row gutter={24}>
            <Col xs={24} md={12}>
              <Form.Item name="name" label="Tên danh mục" rules={[{ required: true, message: 'Nhập tên danh mục.' }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="parentId" label="Danh mục cha">
                <Select allowClear options={MOCK_CATEGORIES.map((c) => ({ value: c.id, label: c.name }))} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </AdminPage>
  )
}

// Từ chối bắt buộc có lý do (DESIGN.md mục 2).
function RejectModal({ listing, onClose, onDone }: { listing?: ListingSummary; onClose: () => void; onDone: () => void }) {
  const [reason, setReason] = useState('')
  return (
    <Modal
      open={!!listing}
      title={`Từ chối: ${listing?.title ?? ''}`}
      okText="Từ chối"
      cancelText="Hủy"
      okButtonProps={{ danger: true, disabled: !reason.trim() }}
      onOk={() => {
        setReason('')
        onDone()
      }}
      onCancel={onClose}
    >
      <p className="muted">Lý do sẽ được gửi cho người bán để sửa bài.</p>
      <Input.TextArea rows={3} maxLength={500} value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Ví dụ: ảnh không đúng sản phẩm" />
    </Modal>
  )
}
