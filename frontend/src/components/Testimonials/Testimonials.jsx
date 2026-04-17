import React from 'react';
import './Testimonials.css';
import SectionHeader from '../SectionHeader/SectionHeader.jsx';

const TESTIMONIALS = [
  {
    id: 1,
    name: "Rajesh Khanna",
    location: "Mumbai",
    text: "The Rudraksha I purchased has brought a visible sense of calm to my daily life. The quality is authentic and the energy is palpable.",
    rating: 5
  },
  {
    id: 2,
    name: "Priya Sharma",
    location: "Delhi",
    text: "I was skeptical about gemstone rings, but the Navratna ring I got here is beautifully crafted. Excellent service and fast delivery.",
    rating: 5
  },
  {
    id: 3,
    name: "Anil Deshmukh",
    location: "Pune",
    text: "Their Vastu Yantra changed the vibration of my office space. I feel much more productive and focused now. Highly recommended!",
    rating: 5
  },
  {
    id: 4,
    name: "Sanjay Mehta",
    location: "Bangalore",
    text: "The vastu consultation was precise. Within weeks of implementing the remedies, there was a visible shift in our home energy.",
    rating: 5
  },
  {
    id: 5,
    name: "Meera Nair",
    location: "Chennai",
    text: "Beautiful collections and very spiritual atmosphere. The staff is knowledgeable and the products are truly divine.",
    rating: 5
  }
];

const Testimonials = () => {
  // Doubling the array for seamless infinite scrolling
  const REEL_ITEMS = [...TESTIMONIALS, ...TESTIMONIALS];

  return (
    <section className="stellar-reel-section">
      <div className="celestial-separator">
        <div className="separator-line"></div>
        <div className="separator-star">✦</div>
        <div className="separator-line"></div>
      </div>

      <div className="stellar-header-wrap">
        <SectionHeader
          title="Seekers of Light"
          subtitle="Voices of Faith"
        />
      </div>

      <div className="infinite-reel-wrapper">
        {/* Single Full-Width Track: Moving Left */}
        <div className="reel-track track-left">
          {REEL_ITEMS.map((item, idx) => (
            <div key={`${item.id}-l-${idx}`} className="reel-card">
              <div className="reel-card__header">
                <div className="reel-stars">✦✦✦✦✦</div>
                <div className="reel-quote">“</div>
              </div>
              <p className="reel-text">{item.text}</p>
              <div className="reel-user">
                <div className="reel-avatar">{item.name.charAt(0)}</div>
                <div className="reel-info">
                  <h4 className="reel-name">{item.name}</h4>
                  <span className="reel-loc">{item.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;