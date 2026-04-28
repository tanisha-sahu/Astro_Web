import './BlogDetailSkeleton.css';

export default function BlogDetailSkeleton() {
  return (
    <div className="blog-skeleton-container">
      <div className="divine-container">
        <section className="skeleton-hero-split">
          <div className="product-skeleton-shimmer skeleton-split-image" />
          <div className="skeleton-split-info">
            <div className="product-skeleton-shimmer skeleton-cat-badge" />
            <div className="product-skeleton-shimmer skeleton-title-main" />
            <div className="skeleton-author-strip">
              <div className="product-skeleton-shimmer skeleton-author-avatar" />
              <div className="skeleton-author-info">
                <div className="product-skeleton-shimmer skeleton-author-name" />
                <div className="product-skeleton-shimmer skeleton-publish-date" />
              </div>
            </div>
          </div>
        </section>
        
        <div className="skeleton-main-content">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="product-skeleton-shimmer skeleton-para" />
          ))}
        </div>
      </div>
    </div>
  );
}
