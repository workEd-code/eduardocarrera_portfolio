import React, { createContext, useContext, useState, useEffect } from 'react';
import { getTranslation } from '../data/translations';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    // Intentar cargar del localStorage
    return localStorage.getItem('portfolio-language') || 'en';
  });

  useEffect(() => {
    // Guardar en localStorage cuando cambie
    localStorage.setItem('portfolio-language', currentLanguage);
  }, [currentLanguage]);

  const t = (key) => {
    return getTranslation(currentLanguage, key);
  };

  const value = {
    currentLanguage,
    setCurrentLanguage,
    t
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};