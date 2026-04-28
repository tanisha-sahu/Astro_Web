import Header from './components/Header/Header.jsx'
import Footer from './components/Footer/Footer.jsx'
import { CartProvider } from './context/CartContext.jsx'
import { WishlistProvider } from './context/WishlistContext.jsx'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import HomePage from './pages/HomePage.jsx'
import SanataniLifePage from './pages/SanataniLifePage.jsx'
import AstroConsultationPage from './pages/AstroConsultationPage.jsx'
import BlogsPage from './pages/BlogsPage.jsx'
import ContactPage from './pages/ContactPage.jsx'
import CartPage from './pages/CartPage.jsx'
import CollectionPage from './pages/CollectionPage.jsx'
import ProductDetailPage from './pages/ProductDetailPage.jsx'
import BlogDetailPage from './pages/BlogDetailPage.jsx'
import SimplePage from './pages/SimplePage.jsx'
import SignupPage from './pages/SignupPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import DashboardCollectionsPage from './pages/DashboardCollectionsPage.jsx'
import DashboardProductsPage from './pages/DashboardProductsPage.jsx'
import DashboardProductEditorPage from './pages/DashboardProductEditorPage.jsx'
import DashboardCollectionEditorPage from './pages/DashboardCollectionEditorPage.jsx'
import DashboardBlogsPage from './pages/DashboardBlogsPage.jsx'
import DashboardBlogEditorPage from './pages/DashboardBlogEditorPage.jsx'
import DashboardAstrologersPage from './pages/DashboardAstrologersPage.jsx'
import DashboardAstrologerEditorPage from './pages/DashboardAstrologerEditorPage.jsx'
import DashboardFavoritesPage from './pages/DashboardFavoritesPage.jsx'
import DashboardOrdersPage from './pages/DashboardOrdersPage.jsx'
import DashboardOrderDetailPage from './pages/DashboardOrderDetailPage.jsx'
import DashboardUsersPage from './pages/DashboardUsersPage.jsx'
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute.jsx'
import useAuthStore from './store/authStore.js'
import { ROLES } from './constants/roles'
import { useEffect } from 'react'
import ScrollToTop from './components/ScrollToTop.jsx'
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
      <WishlistProvider>
        <ScrollToTop />
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
            <Route path="/blog/:id" element={<BlogDetailPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/login" element={<LoginPage />} />
            
            {/* Protected Routes - Any logged in user */}
            <Route element={<ProtectedRoute />}>
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/dashboard/favorites" element={<DashboardFavoritesPage />} />
              <Route path="/dashboard/orders" element={<DashboardOrdersPage />} />
              <Route path="/dashboard/orders/:id" element={<DashboardOrderDetailPage />} />
              <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]} />}>
                <Route path="/dashboard/collections" element={<DashboardCollectionsPage />} />
                <Route path="/dashboard/collections/add" element={<DashboardCollectionEditorPage />} />
                <Route path="/dashboard/collections/edit/:id" element={<DashboardCollectionEditorPage />} />
                <Route path="/dashboard/products" element={<DashboardProductsPage />} />
                <Route path="/dashboard/products/add" element={<DashboardProductEditorPage />} />
                <Route path="/dashboard/products/edit/:id" element={<DashboardProductEditorPage />} />
                <Route path="/dashboard/astrologers" element={<DashboardAstrologersPage />} />
                <Route path="/dashboard/astrologers/add" element={<DashboardAstrologerEditorPage />} />
                <Route path="/dashboard/astrologers/edit/:id" element={<DashboardAstrologerEditorPage />} />
                <Route path="/dashboard/users" element={<DashboardUsersPage />} />
              </Route>

              {/* Blog Management: Both Admin and Astrologer can access */}
              <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.ASTROLOGER]} />}>
                <Route path="/dashboard/blogs" element={<DashboardBlogsPage />} />
                <Route path="/dashboard/blogs/add" element={<DashboardBlogEditorPage />} />
                <Route path="/dashboard/blogs/edit/:id" element={<DashboardBlogEditorPage />} />
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {!isDashboardRoute && <Footer />}
      </WishlistProvider>
    </CartProvider>
  )
}

export default App
