import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import './ProductCategories.css'
import { fetchProductCategories } from '../api/productCategories.js'
import SectionHeader from './SectionHeader.jsx'
import CollectionCard from './CollectionCard.jsx'

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
              <CollectionCard
                key={`cat-skel-${idx}`}
                index={idx}
                isLoading={true}
              />
            ))
            : categories.slice(0, 4).map((cat, index) => {
              const src = cat.image || svgCategoryPlaceholder(cat.title, cat.colors[0], cat.colors[1])

              return (
                <Link
                  key={cat.id}
                  id={cat.id}
                  to={`/collection/${cat.id}`}
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
                </Link>
              )
            })}
        </div>
      </div>
    </section>
  )
}

