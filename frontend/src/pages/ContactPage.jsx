import React, { useState, useEffect } from 'react';
import './ContactPage.css';
import SectionHeader from '../components/SectionHeader';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 5000);
  };

  return (
    <div className="contact-page">
      {/* Decorative Celestial Background */}
      <div className="contact-decorator-bg"></div>
      <div className="contact-glow contact-glow--red"></div>
      <div className="contact-glow contact-glow--gold"></div>

      <section className="contact-container">
        {/* Compact Centered Header */}
        <div className="contact-header-mini">
          <SectionHeader 
            title="Connect With Us" 
            subtitle="Reach out for Sacred Guidance"
          />
        </div>

        <div className="contact-grid">
          {/* Left: Color-Themed Contact Info */}
          <div className="contact-info">
            <div className="info-card info-card--location" style={{ '--i': 0 }}>
              <div className="info-card__icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <div className="info-card__content">
                <h3>Sacred Location</h3>
                <p>108 Celestial Plaza, Varanasi,<br />Uttar Pradesh, India 221001</p>
              </div>
            </div>

            <div className="info-card info-card--hotline" style={{ '--i': 1 }}>
              <div className="info-card__icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.81 12.81 0 00.63 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l2.27-2.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.63A2 2 0 0122 16.92z" />
                </svg>
              </div>
              <div className="info-card__content">
                <h3>Spiritual Hotline</h3>
                <p>+91 91234 56789</p>
                <p>+91 99876 54321</p>
              </div>
            </div>

            <div className="info-card info-card--mail" style={{ '--i': 2 }}>
              <div className="info-card__icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </div>
              <div className="info-card__content">
                <h3>Eternal Mail</h3>
                <p>connect@astrosanatani.com</p>
                <p>support@astrosanatani.com</p>
              </div>
            </div>
          </div>

          {/* Right: Premium Inquiry Form */}
          <div className="contact-form-wrap" style={{ '--i': 3 }}>
            <div className="form-inner-decorator"></div>
            <form className="sacred-form" onSubmit={handleSubmit}>
              <h2 className="form-title">Send a Sacred Inquiry</h2>
              
              <div className="form-group">
                <input 
                  type="text" 
                  name="name" 
                  placeholder="Your Full Name" 
                  required 
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <input 
                  type="email" 
                  name="email" 
                  placeholder="Eternal Email Address" 
                  required 
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <input 
                  type="text" 
                  name="subject" 
                  placeholder="Subject of Inquiry" 
                  required 
                  value={formData.subject}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <textarea 
                  name="message" 
                  placeholder="Your Message/Inquiry..." 
                  rows="5" 
                  required 
                  value={formData.message}
                  onChange={handleChange}
                ></textarea>
              </div>

              <button type="submit" className="sacred-submit">
                {submitted ? 'Inquiry Sent! ✦' : 'Submit Inquiry'}
              </button>
            </form>

            {submitted && (
              <div className="submission-overlay">
                <div className="submission-content">
                  <span className="submission-star">✦</span>
                  <h3>Thank You</h3>
                  <p>Your sacred inquiry has been received. We will connect with you shortly.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
