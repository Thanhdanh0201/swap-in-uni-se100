import { Bell, ChartBar, Flag, Gauge, ListChecks, MapPin, SidebarSimple, SignOut, Storefront, Tag, Users } from '@phosphor-icons/react'
import { Avatar, Button, ConfigProvider, Dropdown, Layout, Menu, Tooltip } from 'antd'
import { useState, type ReactNode } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router'
import { Logo } from '../brand/Logo'
import { useAuth } from '../lib/auth'
import { adminTheme } from '../theme'
import './admin.css'

const ICON = { size: 18, 'aria-hidden': true } as const

// Menu admin. path tương đối với base (/admin, hoặc /dev/admin khi xem thử).
const MENU: { path: string; label: string; icon: ReactNode }[] = [
  { path: '', label: 'Tổng quan', icon: <Gauge {...ICON} /> },
  { path: 'moderation', label: 'Kiểm duyệt', icon: <ListChecks {...ICON} /> },
  { path: 'reports', label: 'Báo cáo vi phạm', icon: <Flag {...ICON} /> },
  { path: 'users', label: 'Người dùng', icon: <Users {...ICON} /> },
  { path: 'categories', label: 'Danh mục', icon: <Tag {...ICON} /> },
  { path: 'meeting-points', label: 'Điểm giao nhận', icon: <MapPin {...ICON} /> },
  { path: 'stats', label: 'Thống kê', icon: <ChartBar {...ICON} /> },
]

export function AdminLayout({ base = '/admin', children }: { base?: string; children?: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)
  const { me, signOut } = useAuth()
  const { pathname } = useLocation()
  const navigate = useNavigate()

  // Mục đang chọn: đường dẫn dài nhất khớp với URL hiện tại.
  const selected = MENU.map((m) => (m.path ? `${base}/${m.path}` : base))
    .filter((p) => pathname === p || pathname.startsWith(`${p}/`))
    .sort((a, b) => b.length - a.length)[0]

  return (
    <ConfigProvider theme={adminTheme}>
      <Layout className="admin">
        <Layout.Header className="admin__header">
          <Tooltip title={collapsed ? 'Mở rộng menu' : 'Thu gọn menu'}>
            <Button type="text" className="admin__icon-btn" icon={<SidebarSimple size={20} />} onClick={() => setCollapsed(!collapsed)} aria-label="Thu gọn menu" />
          </Tooltip>
          <Link to={base} className="admin__brand">
            <Logo inverted /> <span className="admin__brand-tag">Quản trị</span>
          </Link>
          <div className="admin__header-right">
            <Tooltip title="Thông báo">
              <Button type="text" className="admin__icon-btn" icon={<Bell size={20} />} aria-label="Thông báo" />
            </Tooltip>
            <Dropdown
              trigger={['click']}
              menu={{
                items: [
                  { key: 'user', icon: <Storefront {...ICON} />, label: <Link to="/">Về trang người dùng</Link> },
                  { type: 'divider' },
                  { key: 'logout', icon: <SignOut {...ICON} />, label: 'Đăng xuất', danger: true, onClick: () => signOut().then(() => navigate('/')) },
                ],
              }}
            >
              <button type="button" className="admin__user">
                <Avatar size={32} src={me?.avatarUrl ?? undefined}>
                  {me?.fullName?.[0] ?? 'A'}
                </Avatar>
                <span className="admin__user-name">{me?.fullName ?? 'Admin'}</span>
              </button>
            </Dropdown>
          </div>
        </Layout.Header>
        <Layout>
          <Layout.Sider width={220} collapsedWidth={72} collapsible collapsed={collapsed} onCollapse={setCollapsed} breakpoint="lg" trigger={null}>
            <Menu
              theme="dark"
              mode="inline"
              selectedKeys={selected ? [selected] : []}
              items={MENU.map((m) => {
                const to = m.path ? `${base}/${m.path}` : base
                return { key: to, icon: m.icon, label: <Link to={to}>{m.label}</Link> }
              })}
            />
          </Layout.Sider>
          <Layout.Content className="admin__content">{children ?? <Outlet />}</Layout.Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  )
}
