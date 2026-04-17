import React from 'react';
import './PujaServiceBanner.css';

const PujaServiceBanner = () => {
  return (
    <section className="puja-banner">
      <div className="puja-banner__container">
        {/* Banner Text Content */}
        <div className="puja-banner__content">
          <h1 className="puja-banner__title">
            Ancient Wisdom for a Sacred Lifestyle
          </h1>
          <p className="puja-banner__mantra">॥ धर्मो रक्षति रक्षितः ॥</p>
          
          <div className="puja-banner__actions">
            <button className="puja-banner__cta">Explore Collections</button>
            <p className="puja-banner__trust">
              Authentic Vedic Treasures | Timeless Spiritual Essence
            </p>
          </div>
        </div>

        {/* Staggered Image Grid */}
        <div className="puja-banner__grid">
          {/* far left */}
          <div className="puja-banner__img-wrap puja-banner__img--outer-left">
            <img src="/sanatani-life/puja-ritual-1.png" alt="Puja Ritual 1" />
          </div>
          
          {/* inner left */}
          <div className="puja-banner__img-wrap puja-banner__img--inner-left">
            <img src="/sanatani-life/puja-ritual-2.png" alt="Puja Ritual 2" />
          </div>

          {/* Center (Main Hero) */}
          <div className="puja-banner__img-wrap puja-banner__img--center">
            <img src="/sanatani-life/puja-hero-center.png" alt="Puja Hero" />
          </div>

          {/* inner right */}
          <div className="puja-banner__img-wrap puja-banner__img--inner-right">
            <img src="/sanatani-life/puja-ritual-3.png" alt="Puja Ritual 3" />
          </div>

          {/* far right */}
          <div className="puja-banner__img-wrap puja-banner__img--outer-right">
            <img src="/sanatani-life/puja-ritual-4.png" alt="Puja Ritual 4" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default PujaServiceBanner;
