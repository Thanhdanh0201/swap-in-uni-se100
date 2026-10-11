import { createClient, type SupabaseClient } from '@supabase/supabase-js'

// Chỉ dùng ở trình duyệt: phiên đăng nhập (localStorage) và Realtime.
// Dữ liệu nghiệp vụ luôn đi qua API backend, không query bảng trực tiếp bằng client này.
let client: SupabaseClient | null = null

export function getSupabase(): SupabaseClient {
  if (typeof window === 'undefined') throw new Error('Supabase client chỉ dùng ở trình duyệt.')
  client ??= createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY, {
    auth: { flowType: 'pkce', persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
  })
  return client
}

export async function getAccessToken(): Promise<string | undefined> {
  if (typeof window === 'undefined') return undefined
  const { data } = await getSupabase().auth.getSession()
  return data.session?.access_token
}
