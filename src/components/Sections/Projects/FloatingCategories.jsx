import React from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import './FloatingCategories.css';

const FloatingCategories = ({ categories, onCategoryClick, activeCategory }) => {
  const { t } = useLanguage();

  return (
    <div className="floating-categories">
      {categories.map((category) => (
        <div
          key={category.id}
          className={`floating-category ${activeCategory === category.id ? 'active' : ''}`}
          onClick={() => onCategoryClick(category.id)}
        >
          <div className="floating-icon">
            <img src={category.icon} alt={category.id} />
          </div>
          <div className="category-bubble">
            {t(`${category.id}`)}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FloatingCategories;