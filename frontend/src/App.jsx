import Header from './components/Header/Header.jsx'
import Footer from './components/Footer/Footer.jsx'
import { CartProvider } from './context/CartContext.jsx'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import HomePage from './pages/HomePage.jsx'
import SanataniLifePage from './pages/SanataniLifePage.jsx'
import AstroConsultationPage from './pages/AstroConsultationPage.jsx'
import BlogsPage from './pages/BlogsPage.jsx'
import ContactPage from './pages/ContactPage.jsx'
import CartPage from './pages/CartPage.jsx'
import CollectionPage from './pages/CollectionPage.jsx'
import ProductDetailPage from './pages/ProductDetailPage.jsx'
import SimplePage from './pages/SimplePage.jsx'
import SignupPage from './pages/SignupPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute.jsx'
import useAuthStore from './store/authStore.js'
import { useEffect } from 'react'
import './App.css'

function App() {
  const { checkAuth } = useAuthStore()
  const location = useLocation()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  // Hide global Header and Footer on dashboard routes
  const isDashboardRoute = location.pathname.startsWith('/dashboard')

  return (
    <CartProvider>
      {!isDashboardRoute && <Header />}

      <main>
        <Routes>
          <Route path="/cart" element={<CartPage />} />
          <Route path="/collection/:categoryId" element={<CollectionPage />} />
          <Route path="/product/:productId" element={<ProductDetailPage />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/sanatani-life" element={<SanataniLifePage />} />
          <Route path="/astro-consultation" element={<AstroConsultationPage />} />
          <Route path="/blogs" element={<BlogsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          
          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {!isDashboardRoute && <Footer />}
    </CartProvider>
  )
}

export default App
