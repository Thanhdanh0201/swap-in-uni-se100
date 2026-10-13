import type { Session } from '@supabase/supabase-js'
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router'
import { BrandLoader } from '../brand/Mascot'
import { api } from './api'
import { getSupabase } from './supabase'
import type { Me } from './types'

type AuthState = {
  // true cho tới khi đọc xong phiên ở trình duyệt. Server luôn render trạng thái này để tránh lệch hydrate.
  loading: boolean
  session: Session | null
  me: Me | null
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthState>({ loading: true, session: null, me: null, signOut: async () => {} })

export function AuthProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState<Session | null>(null)
  const [me, setMe] = useState<Me | null>(null)

  useEffect(() => {
    const supabase = getSupabase()
    let userId: string | undefined

    const apply = async (next: Session | null) => {
      setSession(next)
      // Token refresh cũng bắn sự kiện: chỉ tải lại hồ sơ khi đổi người dùng.
      if (next?.user.id !== userId) {
        userId = next?.user.id
        setMe(next ? await api<Me>('/api/me').catch(() => null) : null)
      }
      setLoading(false)
    }

    supabase.auth.getSession().then(({ data }) => apply(data.session))
    const { data } = supabase.auth.onAuthStateChange((_event, next) => {
      // Không await trong callback của supabase-js (có thể deadlock): đẩy sang tick sau.
      setTimeout(() => apply(next), 0)
    })
    return () => data.subscription.unsubscribe()
  }, [])

  const signOut = useCallback(async () => {
    await getSupabase().auth.signOut()
  }, [])

  return <AuthContext.Provider value={{ loading, session, me, signOut }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}

// Bọc trang cần đăng nhập. roles: giới hạn thêm theo vai trò (lấy từ profiles.role qua /api/me).
export function RequireAuth({ children, roles }: { children: ReactNode; roles?: Me['role'][] }) {
  const { loading, session, me } = useAuth()
  const location = useLocation()

  if (loading) return <BrandLoader />
  if (!session) return <Navigate to={`/login?next=${encodeURIComponent(location.pathname + location.search)}`} replace />
  if (roles && (!me || !roles.includes(me.role))) return <Navigate to="/" replace />
  return children
}
