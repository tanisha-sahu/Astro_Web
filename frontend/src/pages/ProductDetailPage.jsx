import { useState, useEffect, useMemo } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { productService } from '../services'

import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import useAuthStore from '../store/authStore'
import ProductDetailSkeleton from '../components/ProductDetailSkeleton/ProductDetailSkeleton'
import ProductCardCompact from '../components/ProductCardCompact/ProductCardCompact'
import './ProductDetailPage.css'

export default function ProductDetailPage() {
  const { productId } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthStore()
  const { addToCart, items } = useCart()
  const { toggleWishlist, isFavorite } = useWishlist()
  const [product, setProduct] = useState(null)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [showFeedback, setShowFeedback] = useState(false)

  const favorite = isFavorite(product?._id || product?.id);

  const handleFavorite = () => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    if (product) {
      toggleWishlist(product._id || product.id);
    }
  }

  useEffect(() => {
    let isMounted = true
    async function loadData() {
      setLoading(true)
      setProduct(null)
      setRelatedProducts([])
      
      // Scroll to top when product changes
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Artificial delay to ensure skeleton is visible
      await new Promise(resolve => setTimeout(resolve, 600))

      try {
        const foundProduct = await productService.fetchProductByIdOrSlug(productId)
        if (!isMounted) return
        setProduct(foundProduct)
        
        // Fetch related products (same collection)
        if (foundProduct.categoryId) {
          const related = await productService.fetchProducts({ collection: foundProduct.categoryId })
          if (!isMounted) return
          setRelatedProducts(related.filter(p => p._id !== foundProduct._id).slice(0, 4))
        }
      } catch (error) {
        console.error('Error loading product:', error)
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    loadData()
    return () => { isMounted = false }
  }, [productId])

  const isInCart = useMemo(() => {
    if (!product || !items) return false
    return items.some(item => item.id === product._id)
  }, [product, items])

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    const success = await addToCart(product, quantity)
    if (success) {
      setShowFeedback(true)
    }
  }

  useEffect(() => {
    if (showFeedback) {
      const timer = setTimeout(() => setShowFeedback(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [showFeedback])

  if (loading) return <ProductDetailSkeleton />
  
  if (!product) return (
    <div className="product-not-found-container">
      <div className="divine-container">
        <div className="not-found-content">
          <div className="not-found-icon-wrap">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="not-found-svg">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <div className="icon-glow"></div>
          </div>
          <h1 className="not-found-title">Sacred Item Not Found</h1>
          <p className="not-found-text">
            The item you are seeking may have been moved or is currently out of our celestial inventory. 
            Continue your spiritual journey by exploring our other sacred collections.
          </p>
          <div className="not-found-actions">
            <button onClick={() => navigate('/')} className="btn-return-premium">
              Return Home ✦
            </button>
            <button onClick={() => navigate('/all-products')} className="btn-explore-secondary">
              Browse All Products
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="product-detail-page">
      <div className="divine-container">
        
        {/* --- 1. Top Section: Hero & Summary --- */}
        <section className="product-hero-block">
          <div className="featured-media-area">
            <div className="main-image-wrap">
              <img src={product.img} alt={product.name} />
              <div className="sacred-badge">Energized</div>
            </div>
          </div>

          <div className="product-summary-area">
            <div className="meta-strip">
              <span className="cat-tag-mini">{product.category}</span>
              <div className="separator">•</div>
              <div className="rating-mini-row">
                <span className="stars-gold">★★★★★</span>
                <span className="review-count">({product.reviews || '24+'})</span>
              </div>
            </div>

            <h1 className="detail-title">{product.name}</h1>
            
            <div className="detail-price-row">
              <span className="main-price">₹{product.price?.toLocaleString()}</span>
              {product.oldPrice > product.price && (
                <span className="old-price">₹{product.oldPrice?.toLocaleString()}</span>
              )}
              <span className="tax-note">Inclusive of all taxes</span>
            </div>
            
            <p className="brief-desc">{product.shortDescription || product.description?.substring(0, 150) + '...'}</p>

            <div className="purchase-action-row">
              {product.stock > 0 && (
                <div className="quantity-stepper-compact">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="step-btn">−</button>
                  <div className="qty-val">{quantity}</div>
                  <button onClick={() => setQuantity(quantity + 1)} className="step-btn">+</button>
                </div>
              )}

              <div className="main-btns-cluster">
                  <button 
                    className={`add-to-bag-btn-compact ${showFeedback ? 'success' : ''} ${isInCart ? 'persistent-added' : ''} ${product.stock <= 0 ? 'out-of-stock' : ''}`} 
                    onClick={handleAddToCart}
                    disabled={product.stock <= 0 || showFeedback}
                  >
                    {product.stock <= 0 ? "OUT OF STOCK" : (showFeedback ? "ADDED!" : (isInCart ? "✓ ADDED" : "ADD TO CART"))}
                  </button>
                  <button 
                    className={`wishlist-btn-minimal ${favorite ? 'active' : ''}`} 
                    title={favorite ? "Remove from Wishlist" : "Add to Wishlist"}
                    onClick={handleFavorite}
                  >
                    {favorite ? "♥" : "♡"}
                  </button>
              </div>
            </div>

            {showFeedback && (
              <div className="cart-feedback-toast fade-in">
                Added! <Link to="/cart">View Shopping Bag</Link>
              </div>
            )}
          </div>
        </section>

        {/* --- 2. Sacred Trust Bar: Fills the page horizontally --- */}
        <section className="sacred-trust-bar">
          <div className="t-item">
            <span className="t-icon">🛡️</span>
            <div className="t-content">
              <h4>Authenticity Guaranteed</h4>
              <p>Lab Certified Sanatani Quality</p>
            </div>
          </div>
          <div className="t-item">
            <span className="t-icon">✨</span>
            <div className="t-content">
              <h4>Vedic Energization</h4>
              <p>Activated through Prana Pratishtha</p>
            </div>
          </div>
          <div className="t-item">
            <span className="t-icon">🚚</span>
            <div className="t-content">
              <h4>Priority Shipping</h4>
              <p>Secure global express delivery</p>
            </div>
          </div>
        </section>

        {/* --- 3. Product Insights Section: Side-by-Side --- */}
        <section className="product-insights-block">
          <div className="insight-column narrative-card">
            <h2 className="insight-title">The Spiritual Divinity</h2>
            <div className="insight-text">
              <div dangerouslySetInnerHTML={{ __html: product.description }} />
              {!product.description && (
                <p>
                  In the Sanatani tradition, this sacred item is not merely a physical object but a vessel 
                  for divine energy, energized through traditional Vedic processes to resonate with your 
                  inner chakras.
                </p>
              )}
            </div>
          </div>

          <div className="insight-column technical-card">
            <div className="spec-block">
              <h3 className="block-title">Specifications</h3>
              <table className="specs-table-compact">
                <tbody>
                  {product.specifications && product.specifications.length > 0 ? (
                    product.specifications.map((spec, i) => (
                      <tr key={i}>
                        <td>{spec.label}</td>
                        <td>{spec.value}</td>
                      </tr>
                    ))
                  ) : (
                    <>
                      <tr><td>Material</td><td>Sacred A-Grade Quality</td></tr>
                      <tr><td>Region</td><td>Himalayan Foothills</td></tr>
                      <tr><td>Certification</td><td>Sanatani Trust Certified</td></tr>
                      <tr><td>Vibration</td><td>Positive / High-Frequency</td></tr>
                    </>
                  )}
                </tbody>
              </table>
            </div>

            <div className="care-block">
              <h3 className="block-title">Care Instructions</h3>
              <ul className="care-list-mini">
                {product.careInstructions && product.careInstructions.length > 0 ? (
                  product.careInstructions.map((instr, i) => (
                    <li key={i}>{instr}</li>
                  ))
                ) : (
                  <>
                    <li>Handle with clean hands during prayer sessions.</li>
                    <li>Store in its original sacred velvet pouch.</li>
                    <li>Periodically cleanse with Ganga Jal spray.</li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </section>

        {/* --- 4. Related Products --- */}
        {relatedProducts.length > 0 && (
          <section className="related-section-filled">
            <div className="section-header-row">
              <h2 className="section-title-minimal">You May Also Like</h2>
            </div>
            
            <div className="ecommerce-product-grid-pro">
              {relatedProducts.map((rp, index) => (
                <ProductCardCompact key={rp._id || rp.id} product={rp} index={index} />
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  )
}
