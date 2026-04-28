import './CollectionSkeleton.css'
import '../ProductDetailSkeleton/ProductDetailSkeleton.css' // Reuse shimmer

export default function CollectionSkeleton() {
  return (
    <div className="collection-skeleton">
      <div className="skeleton-category-header">
        <div className="divine-container">
          <div className="product-skeleton-shimmer skeleton-category-title" />
        </div>
      </div>

      <section className="skeleton-toolbar">
        <div className="divine-container">
          <div className="product-skeleton-shimmer skeleton-toolbar-box" />
        </div>
      </section>

      <main>
        <div className="divine-container">
          <div className="skeleton-grid">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="skeleton-product-card">
                <div className="product-skeleton-shimmer skeleton-product-img" />
                <div className="product-skeleton-shimmer skeleton-product-text" />
                <div className="product-skeleton-shimmer skeleton-product-text" style={{ width: '40%' }} />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
