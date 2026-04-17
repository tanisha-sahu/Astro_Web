import { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  User, 
  Mail, 
  Lock, 
  Phone, 
  Calendar, 
  Eye, 
  EyeOff, 
  ArrowRight,
  Sparkles
} from 'lucide-react'
import useAuthStore from '../store/authStore'
import { useNavigate } from 'react-router-dom'
import './SignupPage.css'

export default function SignupPage() {
  const navigate = useNavigate()
  const { register, error, clearError, loading } = useAuthStore()
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dob: '',
    email: '',
    password: '',
    mobile: '',
    agreeTerms: false
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    if (error) clearError()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await register(formData)
      navigate('/dashboard')
    } catch (err) {
      console.error('Registration failed')
    }
  }

  return (
    <div className="signup-page">
      <div className="signup-container">
        <div className="signup-header">
          <div className="celestial-separator">
            <div className="separator-line"></div>
            <div className="separator-star">✦</div>
            <div className="separator-line"></div>
          </div>
          <h1 className="signup-title">Create Your Account</h1>
          <p className="signup-subtitle">Join us on your spiritual journey today.</p>
        </div>

        <form className="signup-form" onSubmit={handleSubmit}>
          {error && <div className="auth-error">{error}</div>}

          <button type="button" className="google-auth-button">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <div className="social-divider">
            <span>or continue with</span>
          </div>

          <div className="form-row">
            <div className="input-group">
              <label className="input-label" htmlFor="firstName">First Name</label>
              <div className="input-wrapper">
                <User className="input-icon" />
                <input 
                  type="text" 
                  id="firstName"
                  name="firstName"
                  className="signup-input" 
                  placeholder="Arjun"
                  value={formData.firstName}
                  onChange={handleChange}
                  required 
                />
              </div>
            </div>
            <div className="input-group">
              <label className="input-label" htmlFor="lastName">Last Name</label>
              <div className="input-wrapper">
                <User className="input-icon" />
                <input 
                  type="text" 
                  id="lastName"
                  name="lastName"
                  className="signup-input" 
                  placeholder="Sharma"
                  value={formData.lastName}
                  onChange={handleChange}
                  required 
                />
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="input-group">
              <label className="input-label" htmlFor="dob">Date of Birth</label>
              <div className="input-wrapper">
                <Calendar className="input-icon" />
                <input 
                  type="date" 
                  id="dob"
                  name="dob"
                  className="signup-input" 
                  value={formData.dob}
                  onChange={handleChange}
                  required 
                />
              </div>
            </div>
            <div className="input-group">
              <label className="input-label" htmlFor="mobile">Mobile Number</label>
              <div className="input-wrapper">
                <Phone className="input-icon" />
                <input 
                  type="tel" 
                  id="mobile"
                  name="mobile"
                  className="signup-input" 
                  placeholder="+91 00000 00000"
                  value={formData.mobile}
                  onChange={handleChange}
                  required 
                />
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="input-group">
              <label className="input-label" htmlFor="email">Email Address</label>
              <div className="input-wrapper">
                <Mail className="input-icon" />
                <input 
                  type="email" 
                  id="email"
                  name="email"
                  className="signup-input" 
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required 
                />
              </div>
            </div>
            <div className="input-group">
              <label className="input-label" htmlFor="password">Password</label>
              <div className="input-wrapper">
                <Lock className="input-icon" />
                <input 
                  type={showPassword ? "text" : "password"} 
                  id="password"
                  name="password"
                  className="signup-input" 
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required 
                />
                <button 
                  type="button" 
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          </div>

          <div className="checkbox-group">
            <input 
              type="checkbox" 
              id="agreeTerms" 
              name="agreeTerms"
              className="checkbox-input"
              checked={formData.agreeTerms}
              onChange={handleChange}
              required 
            />
            <label htmlFor="agreeTerms" className="checkbox-label">
              I agree to the <Link to="/terms">Terms & Conditions</Link> and <Link to="/privacy">Privacy Policy</Link>.
            </label>
          </div>

          <button type="submit" className="signup-button" disabled={loading}>
            {loading ? 'Beginning Journey...' : 'Begin Journey'} <ArrowRight size={18} />
          </button>
        </form>

        <div className="signup-footer">
          Already have an account? <Link to="/login">Sign In</Link>
        </div>

        <div className="celestial-separator" style={{ marginTop: '32px', opacity: 0.5 }}>
          <div className="separator-line" style={{ width: '40px' }}></div>
          <Sparkles size={14} className="separator-star" />
          <div className="separator-line" style={{ width: '40px' }}></div>
        </div>
      </div>
    </div>
  )
}
