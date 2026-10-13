// Logo SwapInUni: mác giá (mua bán) + hai mũi tên ngược chiều (trao đổi). Ảnh ở public/brand/, chữ là text để sắc nét và đọc được.

export function Wordmark() {
  return (
    <span className="wordmark">
      Swap<span className="wordmark__in">In</span>Uni
    </span>
  )
}

export function Logo({ inverted = false }: { inverted?: boolean }) {
  return (
    <span className={`logo${inverted ? ' logo--inverted' : ''}`}>
      <img src={inverted ? '/brand/logo-mark-inverted.svg' : '/brand/logo-mark.svg'} width={32} height={32} alt="" />
      <Wordmark />
    </span>
  )
}
