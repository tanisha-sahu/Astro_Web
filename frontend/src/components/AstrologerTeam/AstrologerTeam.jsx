import React, { useState, useEffect } from 'react';
import './AstrologerTeam.css';
import { userService } from '../../services';
import { IMAGE_BASE_URL } from '../../api/axiosInstance';

export default function AstrologerTeam() {
  const [astrologers, setAstrologers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAstrologers = async () => {
      try {
        const data = await userService.fetchPublicAstrologers();
        setAstrologers(data);
      } catch (error) {
        console.error('Failed to load astrologers:', error);
      } finally {
        setLoading(false);
      }
    };
    loadAstrologers();
  }, []);

  if (loading) {
    return (
      <section className="teamSection">
        <div className="teamContainer">
          <div className="teamHeader">
            <h2 className="teamTitle">Loading Spiritual Guides...</h2>
          </div>
        </div>
      </section>
    );
  }
  return (
    <section className="teamSection">
      {/* Celestial Background Ornaments */}
      <div className="celestial-ornament ornament--top-right">
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="48" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 4" />
          <path d="M50 2L55 45L98 50L55 55L50 98L45 55L2 50L45 45L50 2Z" fill="currentColor" fillOpacity="0.05" />
        </svg>
      </div>
      <div className="celestial-ornament ornament--bottom-left">
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="0.5" />
          <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="0.2" />
        </svg>
      </div>

      <div className="teamContainer">
        <div className="teamHeader">
          <div className="teamEyebrowWrap">
            <span className="teamLine-short" />
            <span className="teamEyebrow">Our Panel of Experts</span>
            <span className="teamLine-short" />
          </div>
          <h2 className="teamTitle">Consult World-Class Astrologers</h2>
          <p className="teamSubtitle">Direct access to India's most profound celestial wisdom</p>
        </div>

        <div className="teamGrid">
          {astrologers.map((astro, index) => (
            <article key={astro._id} className="teamCard" style={{ '--i': index }}>
              <div className="teamImageWrap">
                <div className="teamImageInner">
                  <img 
                    src={astro.image ? (astro.image.startsWith('http') ? astro.image : `${IMAGE_BASE_URL}${astro.image}`) : 'https://via.placeholder.com/300'} 
                    alt={`${astro.firstName} ${astro.lastName}`} 
                    className="teamImage" 
                    loading="lazy" 
                  />
                </div>

                <div className="teamVerifiedBadge">
                  <span className="verifiedIcon">✦</span>
                </div>
              </div>

              <div className="teamInfo">
                <div className="teamRating">
                  <span className="ratingStars">{"✦".repeat(5)}</span>
                  <span className="ratingCount">({Math.floor(Math.random() * 1000) + 500} Reviews)</span>
                </div>
                <h3 className="teamName">{astro.firstName} {astro.lastName}</h3>
                <p className="teamSpecialty">{astro.specialty || 'Vedic Astrology'}</p>
                <div className="teamStats">
                  <span className="teamExp">{astro.experience || '10+ Years'} Exp.</span>
                </div>
                <button type="button" className="teamBtn" onClick={() => window.open(`https://wa.me/91${astro.mobile?.replace(/\D/g,'')}`, '_blank')}>
                  <span>Consult Now</span>
                  <span className="btnSparkle">✦</span>
                </button>
              </div>
              <div className="teamCard-aura" />
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}