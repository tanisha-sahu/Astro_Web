import { useEffect, useState } from 'react'
import { fetchSanataniLifeCategories } from '../api/sanataniLifeCategories.js'
import './SanataniLifeCategories.css'

function svgCategoryPlaceholder(label, c1, c2) {
  const safeLabel = String(label).replace(/&/g, 'and')
  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="700" viewBox="0 0 1200 700">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="${c1}"/>
        <stop offset="1" stop-color="${c2}"/>
      </linearGradient>
    </defs>
    <rect width="1200" height="700" rx="42" fill="url(#g)"/>
    <circle cx="980" cy="130" r="150" fill="rgba(255,255,255,0.18)"/>
    <circle cx="320" cy="560" r="240" fill="rgba(255,255,255,0.12)"/>
    <rect x="70" y="430" width="560" height="150" rx="24" fill="rgba(255,255,255,0.18)" stroke="rgba(255,255,255,0.35)"/>
    <text x="110" y="515" font-size="44" font-family="Segoe UI, Arial" font-weight="800" fill="#ffffff" letter-spacing="-0.8">${safeLabel}</text>
  </svg>`

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}

export default function SanataniLifeCategories() {
  const [categories, setCategories] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let active = true

    async function load() {
      try {
        setIsLoading(true)
        const data = await fetchSanataniLifeCategories()
        if (!active) return
        setCategories(Array.isArray(data) ? data : [])
      } finally {
        if (active) setIsLoading(false)
      }
    }

    load()
    return () => {
      active = false
    }
  }, [])

  return (
    <section className="pageSection sanataniCategoriesSection">
      <h2 className="sectionTitle">Sanatani life categories</h2>
      <div className="slCatGrid" role="list" aria-label="Sanatani life categories" aria-busy={isLoading ? 'true' : 'false'}>
        {(isLoading ? Array.from({ length: 6 }) : categories).map((cat, idx) => {
          if (isLoading) {
            return (
              <div key={`sl-skel-${idx}`} className="slCatCard slCatCard--skeleton" role="listitem" aria-hidden="true">
                <div className="slSkel slSkel--media" />
                <div className="slCatBody">
                  <div className="slSkel slSkel--title" />
                  <div className="slSkel slSkel--desc" />
                </div>
              </div>
            )
          }

          const [c1, c2] = cat.colors
          const src = svgCategoryPlaceholder(cat.title, c1, c2)
          return (
            <a key={cat.id} href={`#${cat.id}`} className="slCatCard" role="listitem" aria-label={cat.title}>
              <img className="slCatMedia" src={src} alt="" loading="lazy" decoding="async" />
              <div className="slCatBody">
                <h3 className="slCatTitle">{cat.title}</h3>
                <p className="slCatDesc">{cat.description}</p>
              </div>
            </a>
          )
        })}
      </div>
    </section>
  )
}

