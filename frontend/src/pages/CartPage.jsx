import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import SectionHeader from '../components/SectionHeader/SectionHeader'
import { useCart } from '../context/CartContext'
import useAuthStore from '../store/authStore'
import CartSkeleton from '../components/CartSkeleton/CartSkeleton'
import './CartPage.css'

export default function CartPage() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthStore()
  const { items, updateQty, removeItem, clearCart, subtotal, loading } = useCart()

  const shipping = items.length === 0 ? 0 : (subtotal > 5000 ? 0 : 150)
  const gst = Math.round(subtotal * 0.18)
  const total = subtotal + shipping + gst

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    // Checkout logic here (e.g. navigate to checkout page)
    console.log('Proceeding to checkout')
  }

  if (loading) return <CartSkeleton />

  return (
    <div className="cart-page">
      <div className="cart-container">
        <SectionHeader 
          title="Shopping Cart" 
          subtitle="Your Sacred Selection"
        />

        {items.length === 0 ? (
          <div className="cart-empty">
            <div className="empty-icon">🛒</div>
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added any spiritual treasures yet.</p>
            <Link to="/" className="continue-btn">Explore Collection</Link>
          </div>
        ) : (
          <div className="cart-grid">
            <div className="cart-items-column">
              <div className="cart-list-header">
                <span>Product</span>
                <span>Price</span>
                <span>Quantity</span>
                <span>Total</span>
                <span className="text-center">Action</span>
              </div>
              
              <div className="cart-items-list">
                {items.map(item => (
                  <div key={item.id} className="cart-item">
                    <div className="item-info">
                      <div className="item-img-wrap">
                        <img src={item.img} alt={item.name} />
                      </div>
                      <div className="item-details">
                        <span className="item-cat">{item.category}</span>
                        <h3>{item.name}</h3>
                      </div>
                    </div>

                    <div className="item-price">
                      <span className="mobile-label">Price: </span>
                      ₹{item.price.toLocaleString()}
                    </div>

                    <div className="item-qty">
                      <span className="mobile-label">Quantity: </span>
                      <div className="qty-stepper">
                        <button onClick={() => updateQty(item.id, -1)} disabled={item.qty <= 1}>-</button>
                        <span>{item.qty}</span>
                        <button onClick={() => updateQty(item.id, 1)}>+</button>
                      </div>
                    </div>

                    <div className="item-total">
                      <span className="mobile-label">Subtotal: </span>
                      ₹{(item.price * item.qty).toLocaleString()}
                    </div>

                    <div className="item-action">
                      <button className="delete-cart-item" onClick={() => removeItem(item.id)} title="Remove Item">
                        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="cart-actions">
                <Link to="/" className="continue-shopping-btn">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M19 12H5M12 19l-7-7 7-7"/>
                  </svg>
                  Continue Shopping
                </Link>

                {items.length > 0 && (
                  <button className="clear-cart-btn" onClick={clearCart}>
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                    Clear Bag
                  </button>
                )}
              </div>
            </div>

            <div className="cart-summary-column">
              <div className="summary-card">
                <h3>Order Summary</h3>
                <div className="summary-rows">
                  <div className="summary-row">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="summary-row">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? <span className="free-shipping">FREE</span> : `₹${shipping}`}</span>
                  </div>
                  <div className="summary-row">
                    <span>GST (18%)</span>
                    <span>₹{gst.toLocaleString()}</span>
                  </div>
                </div>
                
                <div className="summary-total">
                  <span>Total Amount</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>

                <button className="checkout-btn" onClick={handleCheckout}>
                  Proceed to Checkout
                  <span className="btn-shine"></span>
                </button>

                <div className="trust-badges">
                  <div className="badge">
                    <span>🔒</span> 100% Secure Transaction
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
