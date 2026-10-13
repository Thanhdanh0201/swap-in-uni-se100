import { GoogleLogo } from '@phosphor-icons/react'
import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { useAuth } from '../../lib/auth'
import { noIndex } from '../../lib/seo'
import { getSupabase } from '../../lib/supabase'

export const meta = () => noIndex('Đăng nhập')

// Chỉ cho đường dẫn nội bộ, tránh open redirect qua ?next=https://...
function safeNext(next: string | null) {
  return next && next.startsWith('/') && !next.startsWith('//') ? next : '/'
}

export default function Login() {
  const { session } = useAuth()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const next = safeNext(params.get('next'))
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [error, setError] = useState<string>()
  const [info, setInfo] = useState<string>()
  const [busy, setBusy] = useState(false)

  // Đã có phiên (kể cả vừa quay về từ Google): chuyển tiếp.
  useEffect(() => {
    if (session) navigate(next, { replace: true })
  }, [session, next, navigate])

  // Lỗi đăng nhập Google (huỷ, tài khoản bị khóa...) Supabase trả về URL (?error_description=...).
  const shownError = error ?? params.get('error_description')

  async function signInWithGoogle() {
    setError(undefined)
    const { error } = await getSupabase().auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/login?next=${encodeURIComponent(next)}`,
        queryParams: { prompt: 'select_account' },
      },
    })
    if (error) setError(error.message)
  }

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const email = String(form.get('email')).trim().toLowerCase()
    const password = String(form.get('password'))
    setError(undefined)
    setInfo(undefined)

    setBusy(true)
    const supabase = getSupabase()
    const { data, error } =
      mode === 'signin'
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password, options: { data: { full_name: String(form.get('fullName')).trim() } } })
    setBusy(false)

    if (error) setError(error.message === 'Invalid login credentials' ? 'Sai email hoặc mật khẩu.' : error.message)
    else if (mode === 'signup' && !data.session) setInfo('Đã gửi email xác nhận. Mở hộp thư để kích hoạt tài khoản.')
  }

  return (
    <div className="container auth">
      <div className="auth__card stack">
        <h1>{mode === 'signin' ? 'Đăng nhập' : 'Tạo tài khoản'}</h1>
        <p className="muted">Dùng email @gm.uit.edu.vn để có huy hiệu “Đã xác thực UIT”.</p>

        <button type="button" className="btn btn--lg" onClick={signInWithGoogle}>
          <GoogleLogo size={20} weight="bold" aria-hidden /> Tiếp tục với Google
        </button>

        <div className="divider"><span>hoặc</span></div>

        <form className="stack" onSubmit={submit}>
          {mode === 'signup' && (
            <label className="field">
              <span>Họ tên</span>
              <input name="fullName" required autoComplete="name" />
            </label>
          )}
          <label className="field">
            <span>Email</span>
            <input name="email" type="email" required autoComplete="email" placeholder="mssv@gm.uit.edu.vn" />
          </label>
          <label className="field">
            <span>Mật khẩu</span>
            <input name="password" type="password" required minLength={6} autoComplete={mode === 'signin' ? 'current-password' : 'new-password'} />
          </label>
          {shownError && <p className="error" role="alert">{shownError}</p>}
          {info && <p className="note">{info}</p>}
          <button type="submit" className="btn btn--primary btn--lg" disabled={busy}>
            {mode === 'signin' ? 'Đăng nhập' : 'Đăng ký'}
          </button>
        </form>

        <button type="button" className="link-btn" onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}>
          {mode === 'signin' ? 'Chưa có tài khoản? Đăng ký' : 'Đã có tài khoản? Đăng nhập'}
        </button>
      </div>
    </div>
  )
}
