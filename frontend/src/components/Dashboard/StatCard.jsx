import React from 'react';
import './StatCard.css';

const StatCard = ({ title, value, icon: Icon, color, trend }) => {
  return (
    <div className={`stat-card ${color}`}>
      <div className="stat-info">
        <h3>{title}</h3>
        <div className="stat-value">
          <span className="number">{value}</span>
          {trend && <span className="trend">+{trend}</span>}
        </div>
      </div>
      <div className="stat-icon-wrapper">
        <Icon size={24} />
      </div>
    </div>
  );
};

export default StatCard;
