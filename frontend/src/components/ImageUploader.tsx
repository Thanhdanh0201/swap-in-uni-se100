import { Plus } from '@phosphor-icons/react'
import { App, Image, Upload, type UploadFile } from 'antd'
import { useState } from 'react'

const TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_BYTES = 5 * 1024 * 1024

// Chọn ảnh sản phẩm, chưa upload (gửi cùng form khi bấm Đăng bán). Kiểm tra JPG/PNG/WebP, ≤ 5 MB, tối đa `max` ảnh (BR07).
// Backend vẫn kiểm tra lại; ở đây chỉ để báo lỗi sớm. Làm lại từ FileUploader của CMS nội bộ, thêm xem trước ảnh.
export function ImageUploader({ value = [], onChange, max = 6 }: { value?: UploadFile[]; onChange?: (files: UploadFile[]) => void; max?: number }) {
  const { message } = App.useApp()
  const [preview, setPreview] = useState<string>()

  return (
    <>
      <Upload
        listType="picture-card"
        accept={TYPES.join(',')}
        multiple
        fileList={value}
        beforeUpload={(file) => {
          if (!TYPES.includes(file.type)) {
            message.error(`${file.name}: chỉ nhận ảnh JPG, PNG hoặc WebP.`)
            return Upload.LIST_IGNORE
          }
          if (file.size > MAX_BYTES) {
            message.error(`${file.name}: ảnh lớn hơn 5 MB.`)
            return Upload.LIST_IGNORE
          }
          return false
        }}
        onChange={({ fileList }) => {
          if (fileList.length > max) message.warning(`Tối đa ${max} ảnh.`)
          onChange?.(fileList.slice(0, max))
        }}
        onPreview={(file) => setPreview(file.url ?? (file.originFileObj ? URL.createObjectURL(file.originFileObj) : undefined))}
      >
        {value.length < max && (
          <span className="uploader__add">
            <Plus size={20} aria-hidden />
            Thêm ảnh
          </span>
        )}
      </Upload>
      {preview && (
        <Image
          src={preview}
          alt="Xem trước ảnh"
          style={{ display: 'none' }}
          preview={{
            open: true,
            onOpenChange: (open) => {
              if (open) return
              if (preview.startsWith('blob:')) URL.revokeObjectURL(preview)
              setPreview(undefined)
            },
          }}
        />
      )}
    </>
  )
}
