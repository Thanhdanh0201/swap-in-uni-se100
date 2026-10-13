import { ArrowCounterClockwise } from '@phosphor-icons/react'
import { Button, DatePicker, Form, Input, InputNumber, Select } from 'antd'
import dayjs, { type Dayjs } from 'dayjs'
import { useEffect, useMemo, useRef } from 'react'
import { useSearchParams } from 'react-router'
import { applyFilters, readFilters, type FilterField, type FilterValues } from './filters'

const DEBOUNCE_MS = 400

// Bộ lọc danh sách admin, khai báo bằng `fields`. Đổi là lọc ngay (ô chữ/số chờ 400ms), trạng thái nằm trên URL.
// Gộp FilterPanel + SearchAndFilter của CMS nội bộ; dùng trong prop `filters` của AdminPage.
export function FilterPanel({ fields }: { fields: FilterField[] }) {
  const [params, setParams] = useSearchParams()
  const [form] = Form.useForm()
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const initial = useMemo(() => toForm(readFilters(params, fields), fields), [params, fields])

  useEffect(() => () => clearTimeout(timer.current), [])

  const submit = (delay: number) => {
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setParams((prev) => applyFilters(prev, fields, fromForm(form.getFieldsValue(), fields)), { replace: true }), delay)
  }

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={initial}
      className="filter-form"
      onValuesChange={(changed) => {
        const f = fields.find((x) => x.name in changed)
        submit(f && (f.type === 'text' || f.type === 'number') ? DEBOUNCE_MS : 0)
      }}
    >
      {fields.map((f) => (
        <Form.Item key={f.name} name={f.name} label={f.label}>
          {f.type === 'text' ? (
            <Input allowClear placeholder={f.placeholder} />
          ) : f.type === 'number' ? (
            <InputNumber min={f.min} placeholder={f.placeholder} style={{ width: '100%' }} />
          ) : f.type === 'dateRange' ? (
            <DatePicker.RangePicker allowEmpty={[true, true]} format="DD/MM/YYYY" placeholder={['Từ ngày', 'Đến ngày']} style={{ width: '100%' }} />
          ) : (
            <Select allowClear showSearch optionFilterProp="label" mode={f.type === 'multiSelect' ? 'multiple' : undefined} options={f.options} placeholder={f.placeholder ?? 'Tất cả'} />
          )}
        </Form.Item>
      ))}
      <Form.Item label=" " className="filter-form__reset">
        <Button
          icon={<ArrowCounterClockwise size={16} />}
          onClick={() => {
            form.resetFields(fields.map((f) => f.name))
            form.setFieldsValue(Object.fromEntries(fields.map((f) => [f.name, undefined])))
            submit(0)
          }}
        >
          Đặt lại
        </Button>
      </Form.Item>
    </Form>
  )
}

// DateRange: URL lưu chuỗi YYYY-MM-DD, form dùng Dayjs.
function toForm(values: FilterValues, fields: FilterField[]) {
  const out: Record<string, unknown> = { ...values }
  for (const f of fields) {
    const v = values[f.name]
    if (f.type === 'dateRange' && Array.isArray(v)) out[f.name] = v.map((d) => (d ? dayjs(d) : null))
  }
  return out
}

function fromForm(values: Record<string, unknown>, fields: FilterField[]): FilterValues {
  const out: FilterValues = {}
  for (const f of fields) {
    const v = values[f.name]
    if (f.type === 'dateRange') out[f.name] = Array.isArray(v) ? (v as (Dayjs | null)[]).map((d) => d?.format('YYYY-MM-DD') ?? '') : undefined
    else if (typeof v === 'number') out[f.name] = String(v)
    else out[f.name] = v as string | string[] | undefined
  }
  return out
}
