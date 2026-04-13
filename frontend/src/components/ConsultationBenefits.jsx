import React from 'react';
import './ConsultationBenefits.css';
import SectionHeader from './SectionHeader';

const BENEFITS = [
  {
    id: 1,
    icon: "✦",
    title: "Clarity & Direction",
    description: "Gain a profound understanding of your life's purpose and the vocational path destined for you through precise natal chart analysis."
  },
  {
    id: 2,
    icon: "❀",
    title: "Relationship Harmony",
    description: "Receive deep insights into your compatibility and connection with others, helping you build stronger romantic and familial bonds."
  },
  {
    id: 3,
    icon: "☀",
    title: "Career & Growth",
    description: "Identify auspicious periods and cosmic timings for major decisions, job switches, or business ventures to maximize success."
  },
  {
    id: 4,
    icon: "ॐ",
    title: "Spiritual Inner Peace",
    description: "Navigate life's transitions with grace by understanding the karmic lessons and spiritual rhythms guiding your evolution."
  },
  {
    id: 5,
    icon: "☸",
    title: "Remedial Solutions",
    description: "Authentic Vedic remedies and spiritual guidance to overcome life's obstacles and mitigate the impact of planetary doshas."
  },
  {
    id: 6,
    icon: "⚕",
    title: "Wellness Insights",
    description: "Understand the connections between celestial bodies and your underlying physical and mental health patterns for holistic wellbeing."
  }
];

const ConsultationBenefits = () => {
  return (
    <section className="benefits-section">
      <div className="benefits-container">
        <SectionHeader 
          title="Benefits of Consultation" 
          subtitle="The Cosmic Advantage"
        />
        <div className="benefits-grid">
          {BENEFITS.map((benefit) => (
            <article key={benefit.id} className="benefit-card">
              <div className="benefit-icon">{benefit.icon}</div>
              <h3 className="benefit-name">{benefit.title}</h3>
              <p className="benefit-description">{benefit.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ConsultationBenefits;
