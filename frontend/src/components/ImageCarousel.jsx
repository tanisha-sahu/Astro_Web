import { useEffect, useMemo, useState, useRef, useCallback } from 'react'
import './ImageCarousel.css'

export default function ImageCarousel({ slides }) {
  const placeholderSrc = '/images/zodiac_banner.jpg'
  
  // Base raw slides
  const rawSlides = useMemo(() => {
    if (Array.isArray(slides) && slides.length > 0) {
      return slides.map((s, i) => ({
        src: s.src ?? placeholderSrc,
        title: s.title,
        subtitle: s.subtitle,
        alt: `Astrology slide ${i + 1}`,
      }))
    }
    return [{ src: placeholderSrc, alt: 'Default slide', title: 'Astro Sanatani', subtitle: 'Sacred Wisdom' }]
  }, [slides])

  // Infinite Cloning: [Last, 1, 2, 3, First]
  const extendedSlides = useMemo(() => {
    if (rawSlides.length === 0) return []
    if (rawSlides.length === 1) return [rawSlides[0]]
    return [
      rawSlides[rawSlides.length - 1],
      ...rawSlides,
      rawSlides[0]
    ]
  }, [rawSlides])

  const [activeIndex, setActiveIndex] = useState(rawSlides.length > 1 ? 1 : 0)
  const [isTransitioning, setIsTransitioning] = useState(true)
  const [isPaused, setIsPaused] = useState(false)
  
  const timerRef = useRef(null)
  const trackRef = useRef(null)

  const slideCount = rawSlides.length
  const totalSlides = extendedSlides.length

  // Move function
  const moveTo = useCallback((index, smooth = true) => {
    setIsTransitioning(smooth)
    setActiveIndex(index)
  }, [])

  // Auto-play timer
  useEffect(() => {
    if (isPaused || slideCount <= 1) return

    timerRef.current = setInterval(() => {
      moveTo(activeIndex + 1)
    }, 5000)

    return () => clearInterval(timerRef.current)
  }, [activeIndex, isPaused, slideCount, moveTo])

  // Handle seamless loops
  const handleTransitionEnd = () => {
    if (slideCount <= 1) return

    // If we reached the clone of the first slide (at the end)
    if (activeIndex >= totalSlides - 1) {
      moveTo(1, false) // Jump back to index 1 instantly
    }
    // If we reached the clone of the last slide (at the beginning)
    else if (activeIndex <= 0) {
      moveTo(totalSlides - 2, false) // Jump to last real slide instantly
    }
  }

  // Next/Prev actions
  const next = () => moveTo(activeIndex + 1)
  const prev = () => moveTo(activeIndex - 1)

  return (
    <section
      className="carouselContainer"
      aria-label="Infinite product carousel"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="carouselViewport">
        <div 
          ref={trackRef}
          className={`carouselTrack ${!isTransitioning ? 'carouselTrack--instant' : ''}`}
          style={{ transform: `translate3d(-${activeIndex * 100}%, 0, 0)` }}
          onTransitionEnd={handleTransitionEnd}
        >
          {extendedSlides.map((s, i) => (
            <figure
              key={`slide-${i}`}
              className={`carouselSlide ${i === activeIndex ? 'carouselSlide--active' : ''}`}
            >
              <img className="carouselImage" src={s.src} alt={s.alt} draggable={false} />
              {(s.title || s.subtitle) && (
                <figcaption className="carouselContent">
                  {s.title && <h2 className="carouselTitle">{s.title}</h2>}
                  {s.subtitle && <p className="carouselSubtitle">{s.subtitle}</p>}
                </figcaption>
              )}
            </figure>
          ))}
        </div>

        {slideCount > 1 && (
          <div className="carouselArrows">
            <button className="arrowBtn prev" onClick={prev} aria-label="Previous">‹</button>
            <button className="arrowBtn next" onClick={next} aria-label="Next">›</button>
          </div>
        )}
      </div>
    </section>
  )
}
