import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import LanguageSwitcher from '../UI/LanguageSwitcher';
import './Header.css';

const Header = () => {
  const { t } = useLanguage();

  return (
    <header className="header">
      <div className="header-content">
        <div className="title-section">
          <h1 className="title">$ <span className="cursor">eduardocarrera_portfolio</span></h1>
          <div className="subtitle">
            // Full Stack Developer & IT Specialist
            <a 
              href="https://www.linkedin.com/in/eduardo-carrera-dev" 
              target="_blank" 
              rel="noopener noreferrer"
              className="header-linkedin"
              title="LinkedIn Profile"
            >
              <img 
                src="/eduardocarrera_portfolio/assets/img/icons/icon-linkedin.svg" 
                alt="LinkedIn" 
              />
            </a>
          </div>
        </div>
        <LanguageSwitcher />
      </div>
    </header>
  );
};

export default Header;
