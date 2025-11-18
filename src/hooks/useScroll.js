import { useState, useEffect, useRef } from 'react';

export const useScroll = () => {
  const [activeProject, setActiveProject] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const handleScroll = () => {
      // Calcular progreso
      const scrollTop = container.scrollTop;
      const scrollHeight = container.scrollHeight - container.clientHeight;
      const progress = (scrollTop / scrollHeight) * 100;
      setScrollProgress(progress);

      // Detectar proyecto activo usando Intersection Observer
      const projectSlides = container.querySelectorAll('.project-slide');
      const options = {
        root: container,
        rootMargin: '0px',
        threshold: 0.6,
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Array.from(projectSlides).indexOf(entry.target);
            setActiveProject(index);
            entry.target.classList.add('active');
          } else {
            entry.target.classList.remove('active');
          }
        });
      }, options);

      projectSlides.forEach((slide) => observer.observe(slide));

      return () => observer.disconnect();
    };

    container.addEventListener('scroll', handleScroll);

    // Inicializar
    handleScroll();

    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToProject = (index) => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const projectSlides = container.querySelectorAll('.project-slide');
    if (projectSlides[index]) {
      setIsScrolling(true);
      projectSlides[index].scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
      setTimeout(() => setIsScrolling(false), 500);
    }
  };

  return {
    activeProject,
    scrollProgress,
    containerRef,
    scrollToProject,
    isScrolling,
  };
};
