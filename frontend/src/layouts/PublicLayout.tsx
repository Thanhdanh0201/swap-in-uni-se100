import { ChatCircleDots, MagnifyingGlass, Plus, ShieldCheck, SignOut, UserCircle } from '@phosphor-icons/react'
import { Form, Link, NavLink, Outlet, useSearchParams } from 'react-router'
import { Logo } from '../brand/Logo'
import { useAuth } from '../lib/auth'
import { BottomNav } from './BottomNav'

export default function PublicLayout() {
  const { loading, session, me, signOut } = useAuth()
  const [params] = useSearchParams()

  return (
    <>
      <header className="site-header">
        <div className="container site-header__inner">
          <Link to="/" className="brand">
            <Logo />
          </Link>

          <Form method="get" action="/" className="header-search" role="search">
            <MagnifyingGlass size={18} aria-hidden />
            <input name="q" type="search" placeholder="Tìm giáo trình, laptop, xe đạp..." defaultValue={params.get('q') ?? ''} aria-label="Tìm sản phẩm" />
          </Form>

          <nav className="header-nav">
            <Link to="/sell" className="btn btn--primary hide-mobile">
              <Plus size={16} weight="bold" aria-hidden /> Đăng bán
            </Link>
            {/* Chờ đọc phiên ở trình duyệt xong mới hiện, tránh nháy "Đăng nhập" rồi đổi. */}
            {!loading &&
              (session ? (
                <>
                  <NavLink to="/chat" className="icon-link hide-mobile" title="Tin nhắn">
                    <ChatCircleDots size={22} aria-label="Tin nhắn" />
                  </NavLink>
                  <NavLink to="/me/listings" className="icon-link hide-mobile" title="Bài đăng của tôi">
                    <UserCircle size={22} aria-label="Bài đăng của tôi" />
                  </NavLink>
                  {me?.role === 'admin' && (
                    <NavLink to="/admin" className="icon-link" title="Kiểm duyệt">
                      <ShieldCheck size={22} aria-label="Kiểm duyệt" />
                    </NavLink>
                  )}
                  <button type="button" className="icon-link" title="Đăng xuất" onClick={signOut}>
                    <SignOut size={22} aria-label="Đăng xuất" />
                  </button>
                </>
              ) : (
                <Link to="/login" className="btn hide-mobile">
                  Đăng nhập
                </Link>
              ))}
          </nav>
        </div>
      </header>
      <main className="site-main">
        <Outlet />
      </main>
      <footer className="site-footer">
        <div className="container muted">Chợ đồ cũ dành cho sinh viên UIT. Giao dịch trực tiếp, kiểm tra hàng trước khi trả tiền.</div>
      </footer>
      <BottomNav />
    </>
  )
}
