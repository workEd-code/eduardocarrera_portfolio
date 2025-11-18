import { useLanguage } from '../../context/LanguageContext';
import './LanguageSwitcher.css';

const LanguageSwitcher = () => {
  const { currentLanguage, setCurrentLanguage } = useLanguage();

  const handleLanguageChange = (lang) => {
    setCurrentLanguage(lang);
  };

  return (
    <div className="language-switcher">
      <button
        className={`lang-btn ${currentLanguage === 'en' ? 'active' : ''}`}
        onClick={() => handleLanguageChange('en')}
      >
        EN
      </button>
      <button
        className={`lang-btn ${currentLanguage === 'es' ? 'active' : ''}`}
        onClick={() => handleLanguageChange('es')}
      >
        ES
      </button>
    </div>
  );
};

export default LanguageSwitcher;
