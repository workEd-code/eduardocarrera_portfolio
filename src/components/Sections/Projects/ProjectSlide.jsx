import React from 'react';
import './ProjectSlide.css';

const ProjectSlide = ({ project, category, language, isFirst }) => {
  // console.log('Rendering project:', project.name);
  // console.log('Category:', category);
  
  if (!project) {
    return <div className="project-slide">Project data missing</div>;
  }

  const description = project.description?.[language] || project.description?.en || [];
  const links = project.links || {};

  return (
    <div 
      className={`project-slide ${isFirst ? 'first-slide' : ''}`}
      style={{ 
        '--project-background': project.background 
      }}
    >
      <div className="project-slide-content">
        <h3 className="project-title">
          <span className="project-icon">▶</span>
          {project.name}
        </h3>
        
        <div className="project-description">
          <ul className="description-list">
            {description.map((desc, index) => (
              <li key={index} className="description-item">
                {desc}
              </li>
            ))}
          </ul>
        </div>

        {project.technologies && project.technologies.length > 0 && (
          <div className="project-tech">
            {project.technologies.map(tech => (
              <span key={tech} className="tech-tag">
                {tech}
              </span>
            ))}
          </div>
        )}

        {Object.keys(links).length > 0 && (
          <div className="project-links">
            {links.website && (
              <a 
                href={links.website} 
                className="project-link"
                target="_blank" 
                rel="noopener noreferrer"
              >
                <span className="link-icon">🌐</span>
                <span className="link-text">
                  {language === 'en' ? 'View Website' : 'Ver Sitio'}
                </span>
              </a>
            )}
            {links.demo && (
              <a 
                href={links.demo} 
                className="project-link"
                target="_blank" 
                rel="noopener noreferrer"
              >
                <span className="link-icon">🔍</span>
                <span className="link-text">
                  {language === 'en' ? 'View Demo' : 'Ver Demo'}
                </span>
              </a>
            )}
            {links.code && (
              <a 
                href={links.code} 
                className="project-link"
                target="_blank" 
                rel="noopener noreferrer"
              >
                <span className="link-icon">💻</span>
                <span className="link-text">
                  {language === 'en' ? 'View Code' : 'Ver Código'}
                </span>
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectSlide;