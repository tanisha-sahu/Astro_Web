import React, { useEffect, useState } from 'react';
import SectionHeader from '../SectionHeader/SectionHeader';
import ProductCardCompact from '../ProductCardCompact/ProductCardCompact';
import { fetchProducts } from '../../api/products';
import './DivineProductSection.css';

const DivineProductSection = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        setLoading(true)
        const data = await fetchProducts()
        setProducts(data.slice(0, 4))
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
      
      <div className="divine-products-grid">
        {products.map((product, index) => (
          <ProductCardCompact 
            key={product._id} 
            product={product} 
            index={index} 
          />
        ))}
      </div>
    </section>
  );
};

export default DivineProductSection;
