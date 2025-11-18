import React from 'react';
import './MobileProgress.css';

const MobileProgress = ({ scrollProgress }) => {
  const handleClick = () => {
    if (scrollProgress >= 99) {
      // Scroll to top
      const projectsContainer = document.querySelector('.projects-scroll-container');
      if (projectsContainer) {
        projectsContainer.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const circumference = 2 * Math.PI * 27;
  const offset = circumference - (scrollProgress / 100) * circumference;

  return (
    <div 
      className={`mobile-progress ${scrollProgress >= 99 ? 'back-to-top' : ''}`}
      onClick={handleClick}
    >
      <div className="progress-circle">
        <svg className="progress-ring" width="60" height="60">
          <circle 
            className="progress-ring-circle" 
            stroke="var(--accent-color)"
            strokeWidth="4"
            fill="transparent"
            r="27"
            cx="30"
            cy="30"
            style={{
              strokeDasharray: circumference,
              strokeDashoffset: offset
            }}
          />
        </svg>
        <div className="progress-text">
          {scrollProgress >= 99 ? '↑' : `${Math.round(scrollProgress)}%`}
        </div>
      </div>
    </div>
  );
};

export default MobileProgress;