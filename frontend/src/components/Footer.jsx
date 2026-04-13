import React, { useState } from 'react'
import './Footer.css'

const SHOP_LINKS = [
  { label: 'All products', href: '#shop' },
  { label: 'Gemstones & rudraksha', href: '#gemstones' },
  { label: 'Yantras & idols', href: '#yantras' },
  { label: 'Books & calendars', href: '#books' },
  { label: 'Puja essentials', href: '#puja' },
]

const ASTRO_LINKS = [
  { label: 'Astro consultation', href: '#astro-consultation' },
  { label: 'Kundli / birth chart', href: '#kundli' },
  { label: 'Daily horoscope', href: '#horoscope' },
  { label: 'Panchang & muhurat', href: '#panchang' },
  { label: 'Sanatani life', href: '#sanatani-life' },
]

const HELP_LINKS = [
  { label: 'Track order', href: '#track' },
  { label: 'Shipping & delivery', href: '#shipping' },
  { label: 'Returns & refunds', href: '#returns' },
  { label: 'FAQs', href: '#faq' },
  { label: 'Contact us', href: '#contact' },
]

const COMPANY_LINKS = [
  { label: 'About us', href: '#about' },
  { label: 'Blogs', href: '#blogs' },
  { label: 'Privacy policy', href: '#privacy' },
  { label: 'Terms of service', href: '#terms' },
]

export default function Footer() {
  const year = new Date().getFullYear()
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <footer className="divine-foundation">
      {/* Celestial Success Overlay */}
      {showSuccess && (
        <div className="celestial-success-overlay">
          <div className="success-mandala"></div>
          <div className="success-content">
            <div className="success-star">✦</div>
            <h2 className="success-title">Divine Alignment Confirmed</h2>
            <p className="success-msg">Your spiritual journey with us has officially begun.</p>
            <div className="success-glow"></div>
          </div>
        </div>
      )}
      {/* Tier 1: Solar Newsletter Banner */}
      <div className="foundation-newsletter">
        <div className="foundation-newsletter-inner">
          <div className="newsletter-text">
            <h2 className="newsletter-title">Stay Aligned</h2>
            <p className="newsletter-desc">Sacred products and celestial tips — straight to your inbox.</p>
          </div>
          <form className="newsletter-form" onSubmit={handleSubscribe}>
            <input type="email" className="newsletter-input" placeholder="Enter your email" required />
            <button type="submit" className="newsletter-submit">Subscribe</button>
          </form>
        </div>
      </div>

      {/* Tier 2: Institutional Information Grid */}
      <div className="foundation-main">
        <div className="foundation-grid">
          <div className="foundation-brand-col">
            <a href="/" className="foundation-logo-link">
              <img src="/astro-sanatani-logo.png" alt="Astro Sanatani" className="foundation-logo" />
            </a>
            <p className="foundation-tagline">
              Authentic Sanatani products and trusted astrology — curated for your spiritual journey.
            </p>
            <div className="foundation-trust-badges">
              <span>Secure Checkout</span>
              <span>Pan-India Delivery</span>
            </div>
          </div>

          <div className="foundation-link-col">
            <h3 className="foundation-link-heading">Shop</h3>
            <ul className="foundation-list">
              {SHOP_LINKS.map(link => <li key={link.label}><a href={link.href}>{link.label}</a></li>)}
            </ul>
          </div>

          <div className="foundation-link-col">
            <h3 className="foundation-link-heading">Astrology</h3>
            <ul className="foundation-list">
              {ASTRO_LINKS.map(link => <li key={link.label}><a href={link.href}>{link.label}</a></li>)}
            </ul>
          </div>

          <div className="foundation-link-col">
            <h3 className="foundation-link-heading">Guidance</h3>
            <ul className="foundation-list">
              {HELP_LINKS.map(link => <li key={link.label}><a href={link.href}>{link.label}</a></li>)}
            </ul>
          </div>

          <div className="foundation-link-col">
            <h3 className="foundation-link-heading">Company</h3>
            <ul className="foundation-list">
              {COMPANY_LINKS.map(link => <li key={link.label}><a href={link.href}>{link.label}</a></li>)}
            </ul>
          </div>
        </div>
      </div>

      {/* Tier 3: Sacred Bottom Bar */}
      <div className="foundation-bottom">
        <div className="foundation-bottom-inner">
          <p className="foundation-copyright">© {year} Astro Sanatani. Handcrafted with Devotion.</p>
          <div className="foundation-social">
            <a href="#instagram" className="social-orb" aria-label="Instagram">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            </a>
            <a href="#youtube" className="social-orb" aria-label="YouTube">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.42a2.78 2.78 0 0 0-1.94 2C1 8.11 1 12 1 12s0 3.89.46 5.58a2.78 2.78 0 0 0 1.94 2c1.72.42 8.6.42 8.6.42s6.88 0 8.6-.42a2.78 2.78 0 0 0 1.94-2C23 15.89 23 12 23 12s0-3.89-.46-5.58z"></path><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"></polygon></svg>
            </a>
            <a href="#whatsapp" className="social-orb" aria-label="WhatsApp">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-11.7 8.38 8.38 0 0 1 3.8.9L21 3z"></path></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
