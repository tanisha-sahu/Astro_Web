import './ProductDetailSkeleton.css'

export default function ProductDetailSkeleton() {
  return (
    <div className="product-skeleton-container">
      <div className="divine-container">
        
        {/* Hero Section */}
        <section className="skeleton-hero">
          <div className="product-skeleton-shimmer skeleton-media" />
          
          <div className="skeleton-summary">
            <div className="product-skeleton-shimmer skeleton-meta" />
            <div className="product-skeleton-shimmer skeleton-title" />
            <div className="product-skeleton-shimmer skeleton-price-row" />
            <div className="product-skeleton-shimmer skeleton-desc" />
            
            <div className="skeleton-actions">
              <div className="product-skeleton-shimmer skeleton-qty" />
              <div className="product-skeleton-shimmer skeleton-btn" />
              <div className="product-skeleton-shimmer skeleton-btn" style={{ width: '48px', flex: 'none' }} />
            </div>
          </div>
        </section>

        {/* Trust Bar */}
        <section className="product-skeleton-shimmer skeleton-trust-bar" />

        {/* Insights Section */}
        <section className="skeleton-insights">
          <div className="product-skeleton-shimmer skeleton-insight-card" />
          <div className="product-skeleton-shimmer skeleton-insight-card" />
        </section>

      </div>
    </div>
  )
}
