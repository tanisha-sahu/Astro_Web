import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import './ProductGallery.css'
import { productService } from '../../services'


const ProductGallery = () => {
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let active = true

    async function load() {
      try {
        setIsLoading(true)
        const data = await productService.fetchProducts()
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
        <span className="gallery-subtitle">Divine Selection</span>
        <Link to="/sanatani-life" style={{ textDecoration: 'none' }}>
          <h2 className="gallery-title">Our Sacred Products</h2>
        </Link>
        <div className="gallery-line"></div>
      </div>

      <div className="product-scroll-container">
        <div className="product-track" aria-busy={isLoading ? 'true' : 'false'}>
          {(isLoading ? Array.from({ length: 8 }) : products).map((product, idx) => (
            isLoading ? (
              <div key={`prod-skel-${idx}`} className="item-card item-card--skeleton" aria-hidden="true">
                <div className="card-top">
                  <div className="product-skeleton product-skeleton--media" />
                </div>
                <div className="card-bottom">
                  <div className="product-skeleton product-skeleton--title" />
                </div>
              </div>
            ) : (
            <Link key={product.id} to={`/product/${product.id}`} className="item-card reference-style">
              <div className="card-top">
                <div className="zodiac-overlay"></div>
                <div className="brand-mark">✦</div>
                {product.stock <= 0 && <div className="out-of-stock-badge">Sold Out</div>}
                <img src={product.img} alt={product.name} className="product-img-main" loading="lazy" />
              </div>

              <div className="card-bottom">
                <h3 className="product-title">{product.name}</h3>
                <p className="product-subtitle">Your Personalized Roadmap to Sacred Wisdom.</p>
                <div className="product-pricing">
                  <span className="price-label">Price :- </span>
                  {product.oldPrice && <span className="price-old">₹{product.oldPrice.toLocaleString()}/-</span>}
                  <span className="price-current">₹{product.price.toLocaleString()}/- Only</span>
                </div>
                <button className="buy-now-btn">
                  VIEW <span className="arrow-icon">→</span>
                </button>
              </div>
            </Link>
            )
          ))}
        </div>
      </div>
    </section>
  )
}

export default ProductGallery