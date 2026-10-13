import { formatPrice } from '../lib/format'

export function PriceTag({ value, size = 'md' }: { value: number; size?: 'md' | 'lg' }) {
  return <strong className={`price price--${size}`}>{formatPrice(value)}</strong>
}
