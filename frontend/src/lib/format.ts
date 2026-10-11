const vnd = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 })

export function formatPrice(price: number) {
  return price === 0 ? 'Miễn phí' : vnd.format(price)
}

const dateTime = new Intl.DateTimeFormat('vi-VN', { dateStyle: 'short', timeStyle: 'short', timeZone: 'Asia/Ho_Chi_Minh' })

export function formatDateTime(iso: string) {
  return dateTime.format(new Date(iso))
}

// "5 phút trước", "3 ngày trước". Quá 30 ngày thì hiện ngày.
export function timeAgo(iso: string, now = Date.now()) {
  const minutes = Math.floor((now - new Date(iso).getTime()) / 60000)
  if (minutes < 1) return 'Vừa xong'
  if (minutes < 60) return `${minutes} phút trước`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} giờ trước`
  const days = Math.floor(hours / 24)
  if (days <= 30) return `${days} ngày trước`
  return dateTime.format(new Date(iso)).split(' ')[0]
}
