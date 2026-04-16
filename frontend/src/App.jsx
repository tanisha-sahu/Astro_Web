import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import { CartProvider } from './context/CartContext.jsx'
import { Navigate, Route, Routes } from 'react-router-dom'
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
import ProtectedRoute from './components/ProtectedRoute.jsx'
import useAuthStore from './store/authStore.js'
import { useEffect } from 'react'
import './App.css'

function App() {
  const { checkAuth } = useAuthStore()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  return (
    <CartProvider>
      <Header />

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
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />
    </CartProvider>
  )
}

export default App
