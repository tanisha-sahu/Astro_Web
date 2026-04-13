import React from 'react';
import './SectionHeader.css';

const SectionHeader = ({ title, subtitle, align = 'center', light = false }) => {
  return (
    <div className={`section-header-container section-header-container--${align} ${light ? 'section-header-container--light' : ''}`}>
      {subtitle && <span className="section-header__subtitle">{subtitle}</span>}
      <h2 className="section-header__title">{title}</h2>
      <div className="section-header__divider">
        <div className="divider-line"></div>
        <div className="divider-star">✦</div>
        <div className="divider-line"></div>
      </div>
    </div>
  );
};

export default SectionHeader;
