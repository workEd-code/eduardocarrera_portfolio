import React from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import './MobileCategories.css';

const MobileCategories = ({ categories, onCategoryClick, activeCategory }) => {
  const { t } = useLanguage();

  return (
    <div className="mobile-categories-nav">
      {categories.map((category) => (
        <button
          key={category.id}
          className={`mobile-category-btn ${activeCategory === category.id ? 'active' : ''}`}
          onClick={() => onCategoryClick(category.id)}
          title={t(`categories.${category.id}`)}
        >
          <img src={category.icon} alt={category.id} />
        </button>
      ))}
    </div>
  );
};

export default MobileCategories;