import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import './ProductCardCompact.css';

const ProductCardCompact = ({ product, index }) => {
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 2000);
  };

  return (
    <div className="ultra-compact-card" style={{ '--delay': `${index * 0.05}s` }}>
      <Link to={`/product/${product.id}`} className="card-media-ratio">
        <img src={product.img} alt={product.name} loading="lazy" />
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
            className={`add-btn-minimal ${isAdded ? 'added' : ''}`} 
            onClick={handleAdd}
            disabled={isAdded}
          >
              <span className="plus">{isAdded ? '' : '+'}</span>
              <span className="btn-text">{isAdded ? 'Added' : 'Add to Cart'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCardCompact;
