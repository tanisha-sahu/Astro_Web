import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import useAuthStore from '../../store/authStore';
import './ProductCardCompact.css';

const ProductCardCompact = ({ product, index }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { addToCart, items } = useCart();
  const { toggleWishlist, isFavorite } = useWishlist();
  const [showSuccess, setShowSuccess] = useState(false);

  const productId = product._id || product.id;
  const isInCart = items.some(item => item.id === productId);
  const favorite = isFavorite(productId);

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    addToCart(product);
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
    }, 2000);
  };

  const handleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    toggleWishlist(productId);
  };

  return (
    <div className="ultra-compact-card" style={{ '--delay': `${index * 0.05}s` }}>
      <Link to={`/product/${product.id}`} className="card-media-ratio">
        <img src={product.img} alt={product.name} loading="lazy" />
        <button 
          className={`wishlist-toggle-mini ${favorite ? 'active' : ''}`}
          onClick={handleFavorite}
          title={favorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart size={14} fill={favorite ? 'currentColor' : 'none'} />
        </button>
      </Link>
      
      <div className="card-content-compact">
        <div className="card-row-top">
          <span className="cat-mini">{product.category}</span>
          <div className="rate-mini">★ {product.rating || '4.5'}</div>
        </div>
        
        <Link to={`/product/${product.id}`} className="card-name-mini">
          {product.name}
        </Link>
        
        <div className="card-row-bottom">
          <div className="price-bold">₹{product.price.toLocaleString()}</div>
          <button 
            className={`add-btn-minimal ${isInCart ? 'persistent-added' : ''} ${showSuccess ? 'success' : ''} ${product.stock <= 0 ? 'out-of-stock' : ''}`} 
            onClick={handleAdd}
            disabled={product.stock <= 0 || showSuccess}
          >
              <span className="plus">{(isInCart || showSuccess || product.stock <= 0) ? '' : '+'}</span>
              <span className="btn-text">
                {product.stock <= 0 ? 'Sold Out' : (showSuccess ? 'Added!' : (isInCart ? 'In Bag' : 'Add'))}
              </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCardCompact;
