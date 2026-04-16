import { useState, useEffect, useMemo, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { PRODUCTS } from '../data/productsData'
import PRODUCT_CATEGORIES from '../data/productCategoriesData'
import { useCart } from '../context/CartContext'
import ProductCardCompact from '../components/ProductCardCompact'
import './CollectionPage.css'

// Custom Dropdown Component
function CustomSelect({ label, value, options, onChange }) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const selectedOption = options.find(opt => opt.value === value) || options[0]

  return (
    <div className="custom-select-wrap" ref={dropdownRef}>
      <button 
        className={`custom-select-trigger ${isOpen ? 'active' : ''}`} 
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="select-label">{label}:</span>
        <span className="select-value">{selectedOption.label}</span>
        <span className="select-arrow">▾</span>
      </button>
      
      {isOpen && (
        <div className="custom-select-options">
          {options.map((opt) => (
            <div 
              key={opt.value} 
              className={`custom-option ${value === opt.value ? 'selected' : ''}`}
              onClick={() => {
                onChange(opt.value)
                setIsOpen(false)
              }}
            >
              {opt.label}
              {value === opt.value && <span className="check">✓</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function CollectionPage() {
  const { categoryId } = useParams()
  const { addToCart } = useCart()
  const [category, setCategory] = useState(null)
  const [loading, setLoading] = useState(true)

  // Filter States
  const [searchQuery, setSearchQuery] = useState('')
  const [priceRange, setPriceRange] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  
  useEffect(() => {
    setLoading(true)
    const timer = setTimeout(() => {
      const catInfo = PRODUCT_CATEGORIES.find(c => c.id === categoryId)
      setCategory(catInfo)
      setLoading(false)
      window.scrollTo(0, 0)
    }, 400)
    return () => clearTimeout(timer)
  }, [categoryId])

/* Handled by ProductCardCompact */

  const filteredProducts = useMemo(() => {
    let result = PRODUCTS.filter(p => p.categoryId === categoryId)
    if (searchQuery) {
      result = result.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    }
    if (priceRange !== 'all') {
      if (priceRange === 'under-1000') result = result.filter(p => p.price < 1000)
      else if (priceRange === '1000-5000') result = result.filter(p => p.price >= 1000 && p.price <= 5000)
      else if (priceRange === 'over-5000') result = result.filter(p => p.price > 5000)
    }
    if (sortBy === 'price-low') result.sort((a, b) => a.price - b.price)
    else if (sortBy === 'price-high') result.sort((a, b) => b.price - a.price)
    else if (sortBy === 'name-az') result.sort((a, b) => a.name.localeCompare(b.name))
    return result
  }, [categoryId, searchQuery, priceRange, sortBy])

  const priceOptions = [
    { value: 'all', label: 'All Prices' },
    { value: 'under-1000', label: 'Under ₹1,000' },
    { value: '1000-5000', label: '₹1,000 - ₹5,000' },
    { value: 'over-5000', label: 'Over ₹5,000' }
  ]

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'name-az', label: 'Name: A to Z' }
  ]

  if (loading) {
    return (
      <div className="collection-loading-minimal">
        <div className="minimal-spinner"></div>
      </div>
    )
  }

  if (!category) return null

  return (
    <div className="collection-page-simple">
      <div className="category-header-compact">
        <div className="divine-container">
          <h1 className="category-title-minimal">{category.title}</h1>
        </div>
      </div>

      <section className="collection-toolbar-static">
        <div className="divine-container">
          <div className="toolbar-vertical">
            <div className="search-row">
              <div className="search-box-minimal">
                <input 
                  type="text" 
                  placeholder="Search collection..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <span className="icon">🔍</span>
              </div>
            </div>

            <div className="filter-row">
              <div className="filter-controls">
                <CustomSelect 
                  label="Price" 
                  value={priceRange} 
                  options={priceOptions} 
                  onChange={setPriceRange} 
                />
                <CustomSelect 
                  label="Sort" 
                  value={sortBy} 
                  options={sortOptions} 
                  onChange={setSortBy} 
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="category-listing-compact">
        <div className="divine-container">
          <div className="ecommerce-product-grid">
            {filteredProducts.map((product, index) => (
              <ProductCardCompact 
                key={product.id} 
                product={product} 
                index={index} 
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
