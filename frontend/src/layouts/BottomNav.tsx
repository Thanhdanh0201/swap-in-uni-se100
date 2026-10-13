import { ChatCircleDots, House, MegaphoneSimple, PlusCircle, UserCircle } from '@phosphor-icons/react'
import { NavLink } from 'react-router'
import { useAuth } from '../lib/auth'

// Thanh điều hướng dưới, chỉ hiện ở màn < 768px (DESIGN.md mục 3). Nút Đăng bán ở giữa, nổi bật.
export function BottomNav() {
  const { session } = useAuth()
  return (
    <nav className="bottom-nav" aria-label="Điều hướng chính">
      <NavLink to="/" end>
        <House size={24} aria-hidden />
        <span>Trang chủ</span>
      </NavLink>
      <NavLink to="/wanted">
        <MegaphoneSimple size={24} aria-hidden />
        <span>Cần mua</span>
      </NavLink>
      <NavLink to="/sell" className="bottom-nav__primary">
        <PlusCircle size={32} weight="fill" aria-hidden />
        <span>Đăng bán</span>
      </NavLink>
      <NavLink to="/chat">
        <ChatCircleDots size={24} aria-hidden />
        <span>Tin nhắn</span>
      </NavLink>
      <NavLink to={session ? '/me/listings' : '/login'}>
        <UserCircle size={24} aria-hidden />
        <span>Tài khoản</span>
      </NavLink>
    </nav>
  )
}
