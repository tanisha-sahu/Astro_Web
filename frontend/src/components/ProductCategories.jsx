import { useEffect, useState } from 'react'
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
            : categories.map((cat, index) => (
              <CollectionCard
                key={cat.id}
                item={cat}
                index={index}
              />
            ))}
        </div>
      </div>
    </section>
  )
}

