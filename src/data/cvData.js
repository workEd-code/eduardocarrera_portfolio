// src/data/cvData.js
import cvDataEn from './datos-en.json';
import cvDataEs from './datos-es.json';

export const getCVData = (language) => {
  return language === 'en' ? cvDataEn : cvDataEs;
};

export { cvDataEn, cvDataEs };