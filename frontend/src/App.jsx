import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import { Navigate, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage.jsx'
import SanataniLifePage from './pages/SanataniLifePage.jsx'
import AstroConsultationPage from './pages/AstroConsultationPage.jsx'
import BlogsPage from './pages/BlogsPage.jsx'
import ContactPage from './pages/ContactPage.jsx'
import CartPage from './pages/CartPage.jsx'
import SimplePage from './pages/SimplePage.jsx'
import './App.css'

function App() {
  return (
    <>
      <Header />

      <main>
        <Routes>
          <Route path="/cart" element={<CartPage />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/sanatani-life" element={<SanataniLifePage />} />
          <Route path="/astro-consultation" element={<AstroConsultationPage />} />
          <Route path="/blogs" element={<BlogsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />
    </>
  )
}

export default App
