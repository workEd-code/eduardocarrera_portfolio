// src/data/translations.js
import translationsData from './translations.json';

export const getTranslation = (lang, key) => {
  const keys = key.split('.');
  let value = translationsData[lang];

  for (const k of keys) {
    value = value?.[k];
  }

  return value || key;
};

export const getAvailableLanguages = () => Object.keys(translationsData); // ← Cambiar

export default translationsData;