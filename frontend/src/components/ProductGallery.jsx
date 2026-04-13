import { useEffect, useState } from 'react'
import './ProductGallery.css'
import { fetchProducts } from '../api/products.js'

const ProductGallery = () => {
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let active = true

    async function load() {
      try {
        setIsLoading(true)
        const data = await fetchProducts()
        if (!active) return
        setProducts(Array.isArray(data) ? data : [])
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
    <section className="product-showcase">
      <div className="gallery-header">
        <h2 className="gallery-title">Our Sacred Products</h2>
        <div className="gallery-line"></div>
      </div>

      <div className="product-grid" aria-busy={isLoading ? 'true' : 'false'}>
        {(isLoading ? Array.from({ length: 8 }) : products).map((product, idx) => (
          isLoading ? (
            <div key={`prod-skel-${idx}`} className="item-card item-card--skeleton" aria-hidden="true">
              <div className="image-wrapper">
                <div className="product-skeleton product-skeleton--media" />
              </div>
              <div className="product-skeleton product-skeleton--title" />
            </div>
          ) : (
          <div key={product.id} className="item-card">
            <div className="image-wrapper">
              <img src={product.img} alt={product.name} className="product-img" />
              <div className="image-hover-overlay">
                <span>View Product</span>
              </div>
            </div>
            <h3 className="product-name">{product.name}</h3>
          </div>
          )
        ))}
      </div>
    </section>
  )
}

export default ProductGallery