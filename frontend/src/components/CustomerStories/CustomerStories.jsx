import React, { useState } from 'react';
import './CustomerStories.css';
import SectionHeader from '../SectionHeader/SectionHeader.jsx';

const REVIEWS = [
  {
    id: 1,
    name: "Rajbir Singh",
    image: "/customer-stories.jpeg",
    story: "Me and my partner overcome obstacles in our love marriage. Their guidance was instrumental in convincing our families and making our bond stronger than ever.",
  },
  {
    id: 2,
    name: "Anita Verma",
    image: "/customer-stories.jpeg",
    story: "I was facing a major career crisis. The astrologer's precise timing for my job switch was life-changing. I am now in a position I truly love.",
  },
  {
    id: 3,
    name: "Vikram Sethi",
    image: "/customer-stories.jpeg",
    story: "The health readings were incredibly accurate. Following the suggested remedies brought a lot of peace and physical wellness to my life.",
  },
];

const CustomerStories = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const nextSlide = () => setActiveIndex((prev) => (prev + 1) % REVIEWS.length);
  const prevSlide = () => setActiveIndex((prev) => (prev - 1 + REVIEWS.length) % REVIEWS.length);

  return (
    <section className="divine-narratives">
      <div className="celestial-bg-overlay"></div>
      <div className="stories-grid-layout">
        <div className="customer-stories-header-wrap">
          <SectionHeader
            title="Divine Narratives"
            subtitle="Voices of Faith"
          />
        </div>

        {/* Left Side: The Narrative Card */}
        <div className="narrative-main">

          <div className="narrative-card">
            <div className="quote-mark-top">“</div>
            <p className="narrative-text">{REVIEWS[activeIndex].story}</p>

            <div className="narrative-author">
              <div className="author-avatar">
                <img src={REVIEWS[activeIndex].image} alt={REVIEWS[activeIndex].name} />
              </div>
              <div className="author-info">
                <h4 className="author-name">{REVIEWS[activeIndex].name}</h4>
                <div className="author-rating">★★★★★</div>
              </div>
            </div>
          </div>

          <div className="divine-nav">
            <div className="avatar-orb-strip">
              {REVIEWS.map((review, index) => (
                <div
                  key={review.id}
                  className={`avatar-orb ${index === activeIndex ? 'active' : ''}`}
                  onClick={() => setActiveIndex(index)}
                >
                  <img src={review.image} alt={review.name} />
                  <div className="orb-glow"></div>
                </div>
              ))}
            </div>

            <div className="nav-controls">
              <button className="nav-orb-btn" onClick={prevSlide} aria-label="Previous Story">
                <span>←</span>
              </button>
              <button className="nav-orb-btn" onClick={nextSlide} aria-label="Next Story">
                <span>→</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: The Divine Visual */}
        <div className="divine-visual">
          <div className="zodiac-orbit">
            <div className="zodiac-center">
              <div className="logo-rotation-wrapper">
                <img src="/astro-sanatani-logo.png" alt="Sanatani Logo" className="visual-logo" />
              </div>
              <div className="center-pulse"></div>
            </div>
            {/* The Concentric Grand Orbit with Multiple Stars */}
            <div className="orbit-ring orbit-ring--1">
              <div className="satellite-star">✦</div>
            </div>
            <div className="orbit-ring orbit-ring--2">
              <div className="satellite-star">✦</div>
            </div>
            <div className="orbit-ring orbit-ring--3">
              <div className="satellite-star">✦</div>
            </div>
            <div className="orbit-ring orbit-ring--4">
              <div className="satellite-star">✦</div>
            </div>
            <div className="orbit-ring orbit-ring--5">
              <div className="satellite-star">✦</div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default CustomerStories;