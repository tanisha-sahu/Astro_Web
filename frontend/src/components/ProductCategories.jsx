import { useEffect, useState } from 'react'
import './ProductCategories.css'
import { fetchProductCategories } from '../api/productCategories.js'
import SectionHeader from './SectionHeader.jsx'

function svgCategoryPlaceholder(label, c1, c2) {
  const safeLabel = String(label).replace(/&/g, 'and')
  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="700" viewBox="0 0 1200 700">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="${c1}"/>
        <stop offset="1" stop-color="${c2}"/>
      </linearGradient>
      <filter id="blur" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="22"/>
      </filter>
      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="16" stdDeviation="18" flood-color="rgba(0,0,0,0.25)"/>
      </filter>
    </defs>
    <rect width="1200" height="700" rx="42" fill="url(#g)"/>
    <circle cx="980" cy="130" r="150" fill="rgba(255,255,255,0.18)" filter="url(#blur)"/>
    <circle cx="320" cy="560" r="240" fill="rgba(255,255,255,0.12)" filter="url(#blur)"/>
    <g filter="url(#shadow)">
      <rect x="70" y="420" width="560" height="170" rx="28" fill="rgba(255,255,255,0.18)" stroke="rgba(255,255,255,0.35)"/>
      <text x="110" y="505" font-size="44" font-family="Segoe UI, Arial" font-weight="800" fill="#ffffff" letter-spacing="-0.8">${safeLabel}</text>
      <text x="110" y="558" font-size="24" font-family="Segoe UI, Arial" font-weight="700" fill="rgba(255,255,255,0.92)">Shop now</text>
    </g>
  </svg>`

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}

export default function ProductCategories() {
  const [categories, setCategories] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    async function load() {
      try {
        setIsLoading(true)
        const data = await fetchProductCategories()
        if (!isMounted) return
        setCategories(Array.isArray(data) ? data : [])
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }
    load()
    return () => { isMounted = false }
  }, [])



  return (
    <section id="shop" className="pageSection productCategoriesSection">
      {/* Spiritual Background Layer */}
      <div className="cat-mandala-bg"></div>

      <div className="cat-header-wrap">
        <SectionHeader
          title="Divine Collections"
          subtitle="Explore Sacred Wisdom"
        />
      </div>

      <div className="cat-slider-wrapper">


        <div
          className="catGrid"
          role="list"
          aria-label="Product categories"
          aria-busy={isLoading ? 'true' : 'false'}
        >
          {isLoading
            ? Array.from({ length: 4 }).map((_, idx) => (
              <div
                key={`cat-skel-${idx}`}
                className="catCard catCard--skeleton"
                style={{ '--card-index': idx }}
                role="listitem"
                aria-hidden="true"
              >
                <div className="catCard__media">
                  <div className="catSkeleton catSkeleton--media" />
                </div>
                <div className="catCard__body">
                  <div className="catCard__content">
                    <div className="catSkeleton catSkeleton--title" />
                    <div className="catSkeleton catSkeleton--desc" />
                  </div>
                  <div className="catSkeleton catSkeleton--cta" />
                </div>
              </div>
            ))
            : categories.slice(0, 4).map((cat, index) => {
              const src = cat.image || svgCategoryPlaceholder(cat.title, cat.colors[0], cat.colors[1])

              return (
                <a
                  key={cat.id}
                  id={cat.id}
                  href={`#${cat.id}`}
                  className="catCard"
                  style={{ '--card-index': index }}
                  role="listitem"
                  aria-label={cat.title}
                >
                  <div className="catCard__media">
                    <img className="catCard__img" src={src} alt="" loading="lazy" decoding="async" />
                  </div>
                  <div className="catCard__body">
                    <div className="catCard__content">
                      <h3 className="catCard__title">{cat.title}</h3>
                      <p className="catCard__desc">{cat.description}</p>
                    </div>
                    <span className="catCard__cta">
                      Explore <span aria-hidden="true">→</span>
                    </span>
                  </div>
                </a>
              )
            })}
        </div>
      </div>
    </section>
  )
}

