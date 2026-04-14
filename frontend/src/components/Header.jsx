import { useEffect, useMemo, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import useAuthStore from '../store/authStore'
import './Header.css'

const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Sanatani life', to: '/sanatani-life' },
  { label: 'Astro consultation', to: '/astro-consultation' },
  { label: 'Blogs', to: '/blogs' },
  { label: 'Contact', to: '/contact' },
]

const TOP_NAV_LINKS = [
  { label: 'Generate Kundli', to: '/kundli' },
  { label: 'Kundli Milan', to: '/milan' },
  { label: 'Consultation', to: '/astro-consultation' },
  { label: 'Book Pooja', to: '/pooja' },
  { label: 'Narayan Kavach', to: '/kavach' },
  { label: 'Gemstones', to: '/gemstones' },
  { label: 'Rudraksha', to: '/rudraksha' },
  { label: 'Yantras', to: '/yantras' },
]

export default function Header() {
  const { isAuthenticated, logout } = useAuthStore()
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const navId = useMemo(() => 'primary-navigation', [])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    handleScroll() // Initialize on mount
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (!isOpen) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prevOverflow
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return

    const onKeyDown = (e) => {
      if (e.key === 'Escape') setIsOpen(false)
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isOpen])

  const onNavClick = () => setIsOpen(false)

  return (
    <>
    <header className={`siteHeader ${isScrolled ? 'siteHeader--scrolled' : ''}`}>
      <div className="siteHeader__content">
        <div className="topHeader">
          <div className="topHeader__marquee">
            <div className="topHeader__track">
              {TOP_NAV_LINKS.map((link, idx) => (
                <div key={`a-wrap-${idx}`} className="topHeader__item">
                  <Link to={link.to} className="topHeader__link">
                    {link.label}
                  </Link>
                  <span className="topHeader__star">✦</span>
                </div>
              ))}
              {/* Duplicate for infinite effect */}
              {TOP_NAV_LINKS.map((link, idx) => (
                <div key={`b-wrap-${idx}`} className="topHeader__item">
                  <Link to={link.to} className="topHeader__link">
                    {link.label}
                  </Link>
                  <span className="topHeader__star">✦</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="siteHeader__inner">
          <Link className="brand" to="/" aria-label="Go to Home">
            <img
              className="brand__logo"
              src="/astro-sanatani-logo.png"
              width="140"
              height="40"
              alt="Astro Sanatani"
              loading="eager"
              decoding="async"
            />
            <span className="brand__name">Astro Sanatani</span>
          </Link>

        <nav className="nav nav--desktop" aria-label="Primary">
          {NAV_LINKS.map((l) => (
            <NavLink
              key={l.to}
              className={({ isActive }) => 
                `nav__link ${l.label === 'Sanatani life' ? 'nav__link--highlight' : ''} ${isActive ? 'nav__link--active' : ''}`
              }
              to={l.to}
            >
              {l.label === 'Sanatani life' ? (
                <span className="stylized-sl">
                  <span className="stylized-sl__sanatani">sanatani</span>
                  <span className="stylized-sl__life">
                    <span>L</span>
                    <span className="stylized-sl__i">
                      <svg className="stylized-sl__flame" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2C12 2 7 6.09 7 11.5C7 14.54 9.46 17 12 17C14.54 17 17 14.54 17 11.5C17 6.09 12 2 12 2Z" fill="url(#flameGradient)" />
                        <defs>
                          <radialGradient id="flameGradient" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(12 12) rotate(90) scale(5 5)">
                            <stop offset="0%" stopColor="#FFD700" />
                            <stop offset="60%" stopColor="#FF8C00" />
                            <stop offset="100%" stopColor="#FF4500" />
                          </radialGradient>
                        </defs>
                      </svg>
                      i
                    </span>
                    <span>F</span>
                    <span>E</span>
                  </span>
                </span>
              ) : l.label}
            </NavLink>
          ))}
        </nav>

        <div className="headerRight">
          {isAuthenticated ? (
            <div className="user-nav">
              <Link className="iconBtn" to="/profile" aria-label="Profile">
                <svg viewBox="0 0 24 24" role="presentation" aria-hidden="true">
                  <path
                    d="M12 12.2a4.6 4.6 0 1 0-4.6-4.6A4.6 4.6 0 0 0 12 12.2Zm0 2.2c-4.3 0-7.8 2.3-7.8 5.2 0 .8.7 1.4 1.5 1.4h12.6c.8 0 1.5-.6 1.5-1.4 0-2.9-3.5-5.2-7.8-5.2Z"
                    fill="currentColor"
                  />
                </svg>
              </Link>
            </div>
          ) : (
            <Link className="loginBtn" to="/login">
              Login
            </Link>
          )}
          <Link className="iconBtn" to="/cart" aria-label="Cart">
            <svg viewBox="0 0 24 24" role="presentation" aria-hidden="true">
              <path
                d="M7.3 18.2a1.6 1.6 0 1 0 1.6 1.6 1.6 1.6 0 0 0-1.6-1.6Zm10.1 0a1.6 1.6 0 1 0 1.6 1.6 1.6 1.6 0 0 0-1.6-1.6ZM6.2 6.3l.2 1h13.8a1 1 0 0 1 1 .9 1.2 1.2 0 0 1 0 .3l-1.3 6.2a2.3 2.3 0 0 1-2.2 1.8H9.1a2.3 2.3 0 0 1-2.2-1.8L5.6 3.9H3.3a1 1 0 1 1 0-2h3.1a1 1 0 0 1 1 .8l.3 1.6Z"
                fill="currentColor"
              />
            </svg>
          </Link>

          <button
            type="button"
            className={`navToggle ${isOpen ? 'navToggle--open' : ''}`}
            aria-controls={navId}
            aria-expanded={isOpen ? 'true' : 'false'}
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setIsOpen((v) => !v)}
          >
            <span className="srOnly">{isOpen ? 'Close menu' : 'Open menu'}</span>
            <span className="navToggle__icon" aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
          </button>
        </div>
      </div>
    </div>
    </header>
    <div className={`navMobile ${isOpen ? 'navMobile--open' : ''}`} aria-hidden={isOpen ? 'false' : 'true'}>
      <button
        type="button"
        className="navBackdrop"
        aria-label="Close menu"
        onClick={() => setIsOpen(false)}
        tabIndex={isOpen ? 0 : -1}
      />
      <aside className="navDrawer" aria-label="Mobile menu">
        <div className="navDrawer__top">
          <div className="navDrawer__brand">
            <img src="/astro-sanatani-logo.png" alt="Astro Sanatani" className="navDrawer__logo" />
            <span className="navDrawer__title">Sacred Menu</span>
          </div>
          <button type="button" className="navDrawer__close" onClick={() => setIsOpen(false)} aria-label="Close menu">
            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <nav id={navId} className="nav nav--mobile" aria-label="Primary mobile">
          {isAuthenticated ? (
            <NavLink
              to="/profile"
              className={({ isActive }) => `nav__link nav__link--mobile ${isActive ? 'nav__link--active' : ''}`}
              onClick={onNavClick}
              style={{ '--i': 0 }}
            >
              My Profile
            </NavLink>
          ) : (
            <NavLink
              to="/login"
              className={({ isActive }) => `nav__link nav__link--mobile ${isActive ? 'nav__link--active' : ''}`}
              onClick={onNavClick}
              style={{ '--i': 0 }}
            >
              Login / Sign Up
            </NavLink>
          )}
          {NAV_LINKS.map((l, index) => (
            <NavLink
              key={l.to}
              style={{ '--i': index + 1 }}
              className={({ isActive }) => 
                `nav__link nav__link--mobile ${l.label === 'Sanatani life' ? 'nav__link--highlight' : ''} ${isActive ? 'nav__link--active' : ''}`
              }
              to={l.to}
              onClick={onNavClick}
            >
              {l.label === 'Sanatani life' ? (
                <span className="stylized-sl">
                  <span className="stylized-sl__sanatani">sanatani</span>
                  <span className="stylized-sl__life">
                    <span>L</span>
                    <span className="stylized-sl__i">
                      <svg className="stylized-sl__flame" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2C12 2 7 6.09 7 11.5C7 14.54 9.46 17 12 17C14.54 17 17 14.54 17 11.5C17 6.09 12 2 12 2Z" fill="url(#flameGradientMobile)" />
                        <defs>
                          <radialGradient id="flameGradientMobile" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(12 12) rotate(90) scale(5 5)">
                            <stop offset="0%" stopColor="#FFD700" />
                            <stop offset="60%" stopColor="#FF8C00" />
                            <stop offset="100%" stopColor="#FF4500" />
                          </radialGradient>
                        </defs>
                      </svg>
                      i
                    </span>
                    <span>F</span>
                    <span>E</span>
                  </span>
                </span>
              ) : l.label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </div>
  </>
  )
}
