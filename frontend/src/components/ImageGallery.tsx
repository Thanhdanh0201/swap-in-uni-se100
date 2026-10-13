import { ImageBroken } from '@phosphor-icons/react'
import { useRef, useState } from 'react'

// Mobile: vuốt ngang (scroll-snap, không cần thư viện). Desktop: bấm ảnh nhỏ để chuyển.
export function ImageGallery({ images, title }: { images: string[]; title: string }) {
  const track = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)

  if (images.length === 0) {
    return (
      <div className="gallery__empty">
        <ImageBroken size={40} aria-hidden />
        <span className="muted">Chưa có ảnh</span>
      </div>
    )
  }

  const go = (i: number) => {
    const el = track.current
    if (el) el.scrollTo({ left: i * el.clientWidth, behavior: 'smooth' })
  }

  return (
    <div className="gallery">
      <div
        ref={track}
        className="gallery__track"
        onScroll={(e) => {
          const el = e.currentTarget
          const i = Math.round(el.scrollLeft / el.clientWidth)
          if (i !== active) setActive(i)
        }}
      >
        {images.map((src, i) => (
          <img key={src} src={src} alt={`${title} - ảnh ${i + 1}`} loading={i === 0 ? 'eager' : 'lazy'} />
        ))}
      </div>
      {images.length > 1 && (
        <>
          <span className="gallery__count">
            {active + 1}/{images.length}
          </span>
          <div className="gallery__thumbs">
            {images.map((src, i) => (
              <button key={src} type="button" className={i === active ? 'is-active' : ''} onClick={() => go(i)} aria-label={`Xem ảnh ${i + 1}`}>
                <img src={src} alt="" />
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
