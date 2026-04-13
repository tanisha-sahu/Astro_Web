import React from 'react';
import './VideoSection.css';
import SectionHeader from './SectionHeader.jsx';

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
            title="Divine Wisdom Cinema"
            subtitle="Spiritual Insights"
          />
        </div>

        <div className="solar-aura-wrapper">
          <div className="solar-flare-bg"></div>
          <div className="video-player-frame">
            <iframe
              src="https://www.youtube.com/embed/CpqQFCIQURY"
              title="Spiritual Guidance Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          </div>
        </div>

        <p className="divine-video-caption">
          Explore ancient Vedic wisdom and astrological guidance through our curated cinematic insights.
        </p>
      </div>
    </section>
  );
};

export default VideoSection;
