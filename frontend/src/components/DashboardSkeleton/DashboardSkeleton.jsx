import './DashboardSkeleton.css'
import '../ProductDetailSkeleton/ProductDetailSkeleton.css'

export default function DashboardSkeleton({ type = 'grid' }) {
  return (
    <div className={`dashboard-skeleton ${type}`}>
      <div className="product-skeleton-shimmer skeleton-dash-header" />
      
      {type === 'dashboard' && (
        <>
          <div className="skeleton-dash-stats">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="product-skeleton-shimmer skeleton-stat-card" />
            ))}
          </div>
          <div className="skeleton-dash-content-grid">
            <div className="product-skeleton-shimmer skeleton-main-content" />
            <div className="product-skeleton-shimmer skeleton-side-content" />
          </div>
        </>
      )}

      {type === 'grid' && (
        <>
          <div className="product-skeleton-shimmer skeleton-dash-controls" />
          <div className="skeleton-dash-grid">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="product-skeleton-shimmer skeleton-dash-card" />
            ))}
          </div>
        </>
      )}

      {type === 'list' && (
        <>
          <div className="product-skeleton-shimmer skeleton-dash-controls" />
          <div className="product-skeleton-shimmer skeleton-dash-table" />
        </>
      )}

      {type === 'form' && (
        <div className="skeleton-dash-form">
          <div className="product-skeleton-shimmer skeleton-form-card" />
        </div>
      )}
    </div>
  )
}
