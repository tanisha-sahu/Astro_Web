import React, { useEffect } from 'react';
import './AstroConsultationPage.css';
import SectionHeader from '../components/SectionHeader';
import AstrologerTeam from '../components/AstrologerTeam';
import ConsultationBenefits from '../components/ConsultationBenefits';
import Testimonials from '../components/Testimonials';

const SERVICES_DATA = [
  {
    id: 1,
    title: "Vedic Soul Path",
    desc: "A comprehensive analysis of your Janam Kundali to reveal your life's purpose and karma.",
    icon: "✦"
  },
  {
    id: 2,
    title: "Relationship Alchemy",
    desc: "Detailed Guna Milan and compatibility analysis for a prosperous and harmonious union.",
    icon: "⚭"
  },
  {
    id: 3,
    title: "Career & Prosperity",
    desc: "Unlock your professional potential through planetary alignment and business timing.",
    icon: "⚔"
  },
  {
    id: 4,
    title: "Celestial Rectification",
    desc: "Specific Vedic remedies (Upayas) and gemstones recommendations for life's challenges.",
    icon: "⚖"
  }
];

export default function AstroConsultationPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="consult-page">
      {/* Cinematic Hero */}
      <section className="consult-hero">
        <div className="consult-hero__bg">
          <img src="/consult-hero-light.png" alt="Celestial Consultation" />
          <div className="consult-hero__overlay"></div>
        </div>
        <div className="consult-hero__content">
          <SectionHeader 
            title="Divine Soul Mapping" 
            subtitle="Illuminate Your Eternal Journey"
          />
          <p className="consult-hero__text">
            Step into the sacred circle of wisdom. Our expert astrologers decode 
            the celestial languages to provide you with clarity, purpose, and spiritual peace.
          </p>
          <a href="#booking" className="consult-hero__cta">Book a Sacred Session</a>
        </div>
      </section>

      {/* Expert Team */}
      <AstrologerTeam />

      {/* The Sacred Process */}
      <section className="consult-process">
        <div className="consult-container">
          <SectionHeader 
            title="The 3-Step Journey" 
            subtitle="How We Guide You to Clarity"
          />
          <div className="process-grid">
            <div className="process-step" style={{ '--i': 0 }}>
              <div className="step-number">01</div>
              <h3>Deep Analysis</h3>
              <p>We perform an intensive calculation of your birth charts and planetary transits.</p>
            </div>
            <div className="process-step" style={{ '--i': 1 }}>
              <div className="step-number">02</div>
              <h3>Soul Dialogue</h3>
              <p>A personal consultation with a senior expert to discuss insights and questions.</p>
            </div>
            <div className="process-step" style={{ '--i': 2 }}>
              <div className="step-number">03</div>
              <h3>Sacred Guidance</h3>
              <p>Receive personalized remedies and a strategic roadmap for your path forward.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="consult-services">
        <div className="consult-container">
          <SectionHeader 
            title="Sacred Disciplines" 
            subtitle="Boutique Astrological Services"
          />
          <div className="services-grid">
            {SERVICES_DATA.map((service, index) => (
              <div 
                key={service.id} 
                className="service-card"
                style={{ '--i': index }}
              >
                <div className="service-card__icon">{service.icon}</div>
                <h3 className="service-card__title">{service.title}</h3>
                <p className="service-card__desc">{service.desc}</p>
                <div className="service-card__glow"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits & Testimonials */}
      <ConsultationBenefits />
      <Testimonials />

      {/* Sticky Call to Action for Booking */}
      <section id="booking" className="consult-final-cta">
        <div className="consult-container">
          <div className="final-cta-box">
            <h2>Ready to Seek Clarity?</h2>
            <p>Connect with Acharya Sanatani for a transformative one-on-one session.</p>
            <button className="btn btn--primary">Connect via WhatsApp ✦</button>
          </div>
        </div>
      </section>
    </div>
  );
}
