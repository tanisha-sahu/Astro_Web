import React, { useEffect, useState } from 'react';
import SectionHeader from '../SectionHeader/SectionHeader';
import ProductCardCompact from '../ProductCardCompact/ProductCardCompact';
import { productService } from '../../services';

import './DivineProductSection.css';

const DivineProductSection = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        setLoading(true)
        const data = await productService.fetchProducts()
        setProducts(data.slice(0, 12))
      } catch (error) {
        console.error('Failed to load divine products:', error)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading || products.length === 0) return null

  return (
    <section className="divine-products-section">
      <SectionHeader 
        title="Sacred Treasures" 
        subtitle="Curated for your Spiritual Journey" 
      />
      
      <div className="divine-scroll-container">
        <div className="divine-scroll-track">
          {products.map((product, index) => (
            <ProductCardCompact 
              key={product._id} 
              product={product} 
              index={index} 
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default DivineProductSection;
