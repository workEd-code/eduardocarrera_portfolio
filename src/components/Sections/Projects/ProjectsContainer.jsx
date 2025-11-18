import React, { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { getProjects } from '../../../data/projects';
import ProjectSlide from './ProjectSlide';
import FloatingCategories from './FloatingCategories';
import MobileCategories from './MobileCategories';
import ScrollIndicators from './ScrollIndicators';
import MobileProgress from './MobileProgress';
import './ProjectsContainer.css';

const ProjectsContainer = () => {
  const { currentLanguage, t } = useLanguage();
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('');
  const [scrollProgress, setScrollProgress] = useState(0);
  const containerRef = React.useRef(null);

  // Cargar proyectos
  useEffect(() => {
    const projectsData = getProjects();
    setCategories(projectsData);
    if (projectsData.length > 0) {
      setActiveCategory(projectsData[0].id);
    }
  }, []);

  // Función para obtener el índice del primer proyecto de una categoría
  const getFirstProjectIndex = useCallback((categoryId) => {
    let currentIndex = 0;
    for (const category of categories) {
      if (category.id === categoryId) {
        return currentIndex;
      }
      currentIndex += category.projects.length;
    }
    return 0;
  }, [categories]);

  // Función para obtener la categoría del proyecto activo
  const getCategoryByProjectIndex = useCallback((index) => {
    let currentIndex = 0;
    for (const category of categories) {
      const categoryLength = category.projects.length;
      if (index >= currentIndex && index < currentIndex + categoryLength) {
        return category.id;
      }
      currentIndex += categoryLength;
    }
    return categories[0]?.id || '';
  }, [categories]);

  // Manejar scroll
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      // Calcular progreso
      const scrollTop = container.scrollTop;
      const scrollHeight = container.scrollHeight - container.clientHeight;
      const progress = (scrollTop / scrollHeight) * 100;
      setScrollProgress(progress);

      // Detectar proyecto activo y actualizar categoría
      const projectSlides = container.querySelectorAll('.project-slide');
      projectSlides.forEach((slide, index) => {
        const rect = slide.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        
        if (rect.top <= containerRect.top + 100 && rect.bottom >= containerRect.bottom - 100) {
          const newCategory = getCategoryByProjectIndex(index);
          setActiveCategory(newCategory);
          slide.classList.add('active');
        } else {
          slide.classList.remove('active');
        }
      });
    };

    container.addEventListener('scroll', handleScroll);
    
    // Trigger inicial para establecer categoría activa
    handleScroll();
    
    return () => container.removeEventListener('scroll', handleScroll);
  }, [categories, getCategoryByProjectIndex]);

  const scrollToProject = (index) => {
    const container = containerRef.current;
    if (!container) return;

    const projectSlides = container.querySelectorAll('.project-slide');
    if (projectSlides[index]) {
      projectSlides[index].scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  // Nueva función para manejar clic en categorías
  const handleCategoryClick = useCallback((categoryId) => {
    const firstProjectIndex = getFirstProjectIndex(categoryId);
    setActiveCategory(categoryId);
    scrollToProject(firstProjectIndex);
  }, [getFirstProjectIndex]);

  if (!categories || categories.length === 0) {
    return (
      <section className="projects-scroll-section">
        <div className="loading">{t('loadingProjects')}</div>
      </section>
    );
  }

  return (
    <section className="projects-scroll-section">
      {/* Navegación por categorías */}
      <FloatingCategories 
        categories={categories} 
        onCategoryClick={handleCategoryClick}
        activeCategory={activeCategory}
      />
      
      <MobileCategories 
        categories={categories} 
        onCategoryClick={handleCategoryClick}
        activeCategory={activeCategory}
      />

      {/* Contenedor de proyectos con scroll */}
      <div ref={containerRef} className="projects-scroll-container">
        {categories.map((category) =>
          category.projects.map((project, projectIndex) => {
            // Calcular índice global para isFirst
            const globalIndex = categories
              .slice(0, categories.indexOf(category))
              .reduce((acc, cat) => acc + cat.projects.length, 0) + projectIndex;

            return (
              <ProjectSlide
                key={`${category.id}-${project.name}-${projectIndex}`}
                project={project}
                category={category.id}
                language={currentLanguage}
                isFirst={globalIndex === 0}
              />
            );
          })
        )}
      </div>

      {/* Indicadores de scroll */}
      <ScrollIndicators scrollProgress={scrollProgress} />
      <MobileProgress scrollProgress={scrollProgress} />
    </section>
  );
};

export default ProjectsContainer;