import './BlogSkeleton.css'
import '../ProductDetailSkeleton/ProductDetailSkeleton.css'

export default function BlogSkeleton() {
  return (
    <div className="blog-skeleton">
      <div className="skeleton-blog-hero">
        <div className="product-skeleton-shimmer" style={{ width: '200px', height: '24px', marginBottom: '20px' }} />
        <div className="product-skeleton-shimmer" style={{ width: '400px', height: '48px', maxWidth: '90%' }} />
      </div>

      <div className="divine-container">
        <div className="skeleton-blog-grid">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="skeleton-blog-card">
              <div className="product-skeleton-shimmer skeleton-blog-img" />
              <div className="product-skeleton-shimmer skeleton-blog-meta" />
              <div className="product-skeleton-shimmer skeleton-blog-title" />
              <div className="product-skeleton-shimmer skeleton-blog-text" />
              <div className="product-skeleton-shimmer skeleton-blog-text" style={{ width: '80%' }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
