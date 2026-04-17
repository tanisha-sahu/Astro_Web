import SectionHeader from '../SectionHeader/SectionHeader.jsx'
import './BestSellersAstro.css'

const BestSellersAstro = () => {
  return (
    <section className="bs-section">
      <SectionHeader
        title="Best Sellers"
        subtitle="Curated Divine Collections"
      />

      <div className="bs-bento">
        {/* area: hero (2-row spans) */}
        <div className="bs-block bs-block--hero">
          <img src="/best-seller/rudraksh.webp" alt="Rudraksha" />
          <div className="bs-content">
            <span className="bs-badge">Energized</span>
            <h3 className="bs-title">Sacred Rudraksha</h3>
          </div>
        </div>

        {/* area: wide (2-column span) */}
        <div className="bs-block bs-block--wide">
          <img src="/best-seller/wellness.jpeg" alt="Wellness" />
          <div className="bs-content">
            <span className="bs-badge">Wellness Kit</span>
            <h3 className="bs-title">Spiritual Sadhana Collection</h3>
          </div>
        </div>

        {/* area: ring (single) */}
        <div className="bs-block bs-block--ring">
          <img src="/best-seller/navratn.jpeg" alt="Navratna" />
          <div className="bs-content">
            <h3 className="bs-title">Navratna Ring</h3>
          </div>
        </div>

        {/* area: extra (single) */}
        <div className="bs-block bs-block--extra">
          <img src="/best-seller/rudraksh.webp" alt="Protective Yantra" />
          <div className="bs-content">
            <h3 className="bs-title">Siddh Yantra</h3>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BestSellersAstro;