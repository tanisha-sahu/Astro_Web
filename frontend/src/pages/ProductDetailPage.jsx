import { useState, useEffect, useMemo } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { PRODUCTS } from '../data/productsData'
import { useCart } from '../context/CartContext'
import './ProductDetailPage.css'

export default function ProductDetailPage() {
  const { productId } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [showFeedback, setShowFeedback] = useState(false)
  const [isWishlisted, setIsWishlisted] = useState(false)

  const toggleWishlist = () => setIsWishlisted(!isWishlisted)

  useEffect(() => {
    setLoading(true)
    const foundProduct = PRODUCTS.find(p => p.id === parseInt(productId))
    if (foundProduct) {
      setProduct(foundProduct)
      window.scrollTo(0, 0)
    }
    setLoading(false)
  }, [productId])

  const relatedProducts = useMemo(() => {
    if (!product) return []
    return PRODUCTS
      .filter(p => p.categoryId === product.categoryId && p.id !== product.id)
      .slice(0, 4)
  }, [product])

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product)
    }
    setShowFeedback(true)
    setTimeout(() => setShowFeedback(false), 3000)
  }

  if (loading) return <div className="product-detail-loader"><div className="spinner-gold"></div></div>
  if (!product) return <div className="p-40 text-center">Product not found. <Link to="/" className="text-gold">Return Home</Link></div>

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
                <span className="review-count">({product.reviews})</span>
              </div>
            </div>

            <h1 className="detail-title">{product.name}</h1>
            
            <div className="detail-price-row">
              <span className="main-price">₹{product.price.toLocaleString()}</span>
              <span className="tax-note">Inclusive of all taxes</span>
            </div>
            
            <p className="brief-desc">{product.description}</p>

            <div className="purchase-action-row">
              <div className="quantity-stepper-compact">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="step-btn">−</button>
                <div className="qty-val">{quantity}</div>
                <button onClick={() => setQuantity(quantity + 1)} className="step-btn">+</button>
              </div>

              <div className="main-btns-cluster">
                  <button 
                    className="add-to-bag-btn-compact" 
                    onClick={handleAddToCart}
                    style={{ background: showFeedback ? '#4caf50' : '' }}
                  >
                    {showFeedback ? "ADDED!" : "ADD TO CART"}
                  </button>
                  <button 
                    className={`wishlist-btn-minimal ${isWishlisted ? 'active' : ''}`} 
                    title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                    onClick={toggleWishlist}
                  >
                    {isWishlisted ? "♥" : "♡"}
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
              <p>{product.description}</p>
              <p>
                In the Sanatani tradition, this sacred item is not merely a physical object but a vessel 
                for divine energy. Hand-picked from the holy regions of the Himalayas, it undergoes a 
                rigorous 11-step purification and energization process to ensure it resonates with your 
                inner chakras.
              </p>
              <p>
                Whether placed in your Puja altar or carried with you, it serves as a constant 
                reminder of the eternal cosmic vibration.
              </p>
            </div>
          </div>

          <div className="insight-column technical-card">
            <div className="spec-block">
              <h3 className="block-title">Specifications</h3>
              <table className="specs-table-compact">
                <tbody>
                  <tr><td>Material</td><td>Sacred A-Grade Quality</td></tr>
                  <tr><td>Region</td><td>Himalayan Foothills</td></tr>
                  <tr><td>Certification</td><td>Sanatani Trust Certified</td></tr>
                  <tr><td>Vibration</td><td>Positive / High-Frequency</td></tr>
                </tbody>
              </table>
            </div>

            <div className="care-block">
              <h3 className="block-title">Care Instructions</h3>
              <ul className="care-list-mini">
                <li>Handle with clean hands during prayer sessions.</li>
                <li>Store in its original sacred velvet pouch.</li>
                <li>Periodically cleanse with Ganga Jal spray.</li>
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
                <div key={rp.id} className="ultra-compact-card-pro" style={{ '--delay': `${index * 0.05}s` }}>
                  <Link to={`/product/${rp.id}`} className="card-media-ratio-pro">
                    <img src={rp.img} alt={rp.name} loading="lazy" />
                  </Link>
                  
                  <div className="card-content-compact">
                    <div className="card-row-top">
                      <span className="cat-mini">{rp.category}</span>
                      <div className="rate-mini">★ {rp.rating}</div>
                    </div>
                    
                    <Link to={`/product/${rp.id}`} className="card-name-mini">
                      {rp.name}
                    </Link>
                    
                    <div className="card-row-bottom">
                      <div className="price-bold">₹{rp.price.toLocaleString()}</div>
                      <button 
                        className="add-btn-minimal" 
                        onClick={(e) => {
                          e.preventDefault();
                          addToCart(rp);
                        }}
                      >
                        + Add
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  )
}
