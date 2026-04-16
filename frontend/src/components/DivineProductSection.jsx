import React from 'react';
import SectionHeader from './SectionHeader';
import ProductCardCompact from './ProductCardCompact';
import { PRODUCTS } from '../data/productsData';
import './DivineProductSection.css';

const DivineProductSection = () => {
  // Pick some representative products
  // Or in a real app, this might be filtered by a specific tag
  const sacredProducts = PRODUCTS.slice(0, 4);

  return (
    <section className="divine-products-section">
      <SectionHeader 
        title="Sacred Treasures" 
        subtitle="Curated for your Spiritual Journey" 
      />
      
      <div className="divine-products-grid">
        {sacredProducts.map((product, index) => (
          <ProductCardCompact 
            key={product.id} 
            product={product} 
            index={index} 
          />
        ))}
      </div>
    </section>
  );
};

export default DivineProductSection;
