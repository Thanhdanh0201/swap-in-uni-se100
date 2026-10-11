import { getAccessToken } from './supabase'

export class ApiError extends Error {
  status: number
  errors?: Record<string, string[]>
  // Mã lỗi nghiệp vụ (AppException backend): "not_pending", "own_listing"...
  code?: string

  constructor(status: number, message: string, errors?: Record<string, string[]>, code?: string) {
    super(message)
    this.status = status
    this.errors = errors
    this.code = code
  }
}

// Trình duyệt: đường dẫn tương đối (Vite proxy). Server SSR: gọi thẳng backend.
const BASE = typeof window === 'undefined' ? (process.env.API_URL ?? 'http://localhost:5180') : (import.meta.env.VITE_API_BASE_URL ?? '')

function toApiError(status: number, body: unknown): ApiError {
  const b = (body ?? {}) as { detail?: string; title?: string; code?: string; errors?: Record<string, string[]> }
  const firstError = b.errors ? Object.values(b.errors)[0]?.[0] : undefined
  return new ApiError(status, firstError || b.detail || b.title || `Yêu cầu thất bại (${status}).`, b.errors, b.code)
}

// Gọi API backend. Ở trình duyệt tự gắn access token Supabase (supabase-js tự refresh token).
// Backend bọc response thành công { success, message, data }: trả thẳng data.
export async function api<T>(path: string, init: RequestInit & { json?: unknown } = {}): Promise<T> {
  const { json, headers, ...rest } = init
  const token = await getAccessToken()
  const res = await fetch(BASE + path, {
    ...rest,
    headers: {
      Accept: 'application/json',
      ...(json !== undefined && { 'Content-Type': 'application/json' }),
      ...(token && { Authorization: `Bearer ${token}` }),
      ...headers,
    },
    body: json !== undefined ? JSON.stringify(json) : rest.body,
  })

  const body = res.headers.get('content-type')?.includes('json') ? await res.json() : undefined
  if (!res.ok) throw toApiError(res.status, body)
  return (body && typeof body === 'object' && 'success' in body ? (body as { data?: unknown }).data : body) as T
}

export function toQuery(params: Record<string, string | number | undefined | null>) {
  const q = new URLSearchParams()
  for (const [k, v] of Object.entries(params)) if (v !== undefined && v !== null && v !== '') q.set(k, String(v))
  const s = q.toString()
  return s ? `?${s}` : ''
}
