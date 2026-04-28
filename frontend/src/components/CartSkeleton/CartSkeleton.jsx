import './CartSkeleton.css'
import '../ProductDetailSkeleton/ProductDetailSkeleton.css'

export default function CartSkeleton() {
  return (
    <div className="cart-skeleton">
      <div className="divine-container">
        <div className="product-skeleton-shimmer skeleton-cart-header" />
        
        <div className="skeleton-cart-grid">
          <div className="skeleton-cart-items">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="product-skeleton-shimmer skeleton-cart-item" />
            ))}
          </div>
          <div className="product-skeleton-shimmer skeleton-cart-summary" />
        </div>
      </div>
    </div>
  )
}
