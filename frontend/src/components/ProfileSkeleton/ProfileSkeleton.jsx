import './ProfileSkeleton.css';

export default function ProfileSkeleton() {
  return (
    <div className="profile-skeleton-container">
      <div className="profile-container">
        {/* Header Skeleton */}
        <div className="skeleton-card header-skeleton">
          <div className="skeleton-avatar shimmer" />
          <div className="skeleton-intro">
            <div className="skeleton-line title shimmer" />
            <div className="skeleton-line subtitle shimmer" />
          </div>
          <div className="skeleton-button shimmer" />
        </div>

        {/* Content Skeleton */}
        <div className="skeleton-card content-skeleton">
          <div className="skeleton-section-header">
            <div className="skeleton-line title shimmer" />
            <div className="skeleton-line subtitle shimmer" />
          </div>

          <div className="skeleton-grid">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="skeleton-grid-item">
                <div className="skeleton-icon-box shimmer" />
                <div className="skeleton-text-group">
                  <div className="skeleton-line label shimmer" />
                  <div className="skeleton-line value shimmer" />
                </div>
              </div>
            ))}
          </div>

          <div className="skeleton-actions">
            <div className="skeleton-action-item shimmer" />
            <div className="skeleton-action-item shimmer" />
          </div>
        </div>
      </div>
    </div>
  );
}
