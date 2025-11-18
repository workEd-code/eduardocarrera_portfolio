import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import About from '../components/Sections/About';
import ProjectsContainer from '../components/Sections/Projects/ProjectsContainer';

const Home = () => {
  const { t } = useLanguage();

  return (
    <main className="container">
      <About />
      <div className="section-divider">
        <span>{t('projects.title')}</span>
      </div>
      <ProjectsContainer />
    </main>
  );
};

export default Home;