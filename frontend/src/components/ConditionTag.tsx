import { CONDITION_LABELS } from '../lib/status'
import type { ListingCondition } from '../lib/types'

export function ConditionTag({ condition }: { condition: ListingCondition }) {
  return <span className="chip">{CONDITION_LABELS[condition]}</span>
}
