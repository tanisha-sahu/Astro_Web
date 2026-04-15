import { useEffect, useState } from 'react'
import { fetchSanataniLifeCategories } from '../api/sanataniLifeCategories.js'
import './SanataniLifeCategories.css'
import SectionHeader from './SectionHeader.jsx'
import CollectionCard from './CollectionCard.jsx'

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
      {/* Structural wrap similar to home page for consistency */}
      <div className="cat-header-wrap">
        <SectionHeader
          title="Sanatani Life"
          subtitle="Divine Lifestyle categories"
        />
      </div>

      <div className="cat-slider-wrapper">
        <div
          className="catGrid"
          role="list"
          aria-label="Sanatani life categories"
          aria-busy={isLoading ? 'true' : 'false'}
        >
          {isLoading
            ? Array.from({ length: 4 }).map((_, idx) => (
              <CollectionCard
                key={`sl-skel-${idx}`}
                index={idx}
                isLoading={true}
              />
            ))
            : categories.map((cat, idx) => (
              <CollectionCard
                key={cat.id}
                item={cat}
                index={idx}
              />
            ))}
        </div>
      </div>
    </section>
  )
}

