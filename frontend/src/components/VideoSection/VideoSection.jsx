import React from 'react';
import './VideoSection.css';
import SectionHeader from '../SectionHeader/SectionHeader.jsx';

const VideoSection = () => {
  return (
    <section className="divine-video-section">
      <div className="celestial-stars-overlay"></div>

      <div className="celestial-separator">
        <div className="separator-line"></div>
        <div className="separator-star">✦</div>
        <div className="separator-line"></div>
      </div>

      <div className="divine-video-container">
        <div className="divine-video-header">
          <SectionHeader
            title="Divine Presence"
            subtitle="Spiritual Essence"
          />
        </div>

        <div className="solar-aura-wrapper">
          <div className="solar-flare-bg"></div>
          <div className="video-player-frame">
            <div className="video-thumbnail-wrapper">
              <img 
                src="/home-banner-images/last-banner.png" 
                alt="Divine Presence Banner" 
                className="video-banner-thumbnail"
              />
            </div>
          </div>
        </div>

        <p className="divine-video-caption">
          Experience the divine craftmanship and spiritual energy captured in our sacred collections.
        </p>
      </div>
    </section>
  );
};

export default VideoSection;
