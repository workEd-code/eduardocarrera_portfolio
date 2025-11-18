import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { getCVData } from '../../../data/cvData';
import { Link } from 'react-router-dom';
import CVControls from './CVControls';
import CVSection from './CVSection';
import './CVViewer.css';

const CVViewer = () => {
  const { currentLanguage } = useLanguage();
  const [cvData, setCvData] = useState(null);
  const [zoom, setZoom] = useState(100);
  const [theme, setTheme] = useState('default');
  const pdfRef = useRef();

  useEffect(() => {
    const data = getCVData(currentLanguage);
    setCvData(data);
  }, [currentLanguage]);

  if (!cvData) {
    return <div className="cv-loading">Loading CV...</div>;
  }

  return (
    <div className="cv-viewer-container">
      <div className="cv-navigation">
        <Link to="/" className="back-button">
          <i className="fas fa-arrow-left"></i> Back
        </Link>
      </div>

      <CVControls 
        zoom={zoom} 
        setZoom={setZoom}
        theme={theme}
        setTheme={setTheme}
        language={currentLanguage}
        pdfElementRef={pdfRef}
      />

      {/* Versión responsive con zoom */}
      <div className={`cv-viewer zoom-${zoom}`} data-theme={theme}>
        <div className="cv-content" id="cv-content">
          <div className="cv-basics">
            <h1>{cvData.basics.name}</h1>
            <div className="headline">{cvData.basics.headline}</div>
            <div className="contact-info">
              <div className="contact-item"><i className="fas fa-map-marker-alt"></i><span>{cvData.basics.location}</span></div>
              <div className="contact-item"><i className="fas fa-phone"></i><span>{cvData.basics.phone}</span></div>
              <div className="contact-item"><i className="fas fa-envelope"></i><span>{cvData.basics.email}</span></div>
              <div className="contact-item"><i className="fas fa-link"></i>
                <a href={cvData.basics.url.href} target="_blank" rel="noopener noreferrer">
                  {cvData.basics.url.label}
                </a>
              </div>
            </div>
          </div>

          <div className="cv-layout">
            <div className="cv-column left-column">
              {cvData.layout[0].map(sectionKey => (
                <CVSection key={sectionKey} section={cvData.sections[sectionKey]} sectionKey={sectionKey} />
              ))}
            </div>
            <div className="cv-column right-column">
              {cvData.layout[1].map(sectionKey => (
                <CVSection key={sectionKey} section={cvData.sections[sectionKey]} sectionKey={sectionKey} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* VERSIÓN A4 REAL (OCULTA) - ESTE ES EL QUE SE USA PARA PDF */}
      <div 
        className="cv-a4-pdf" 
        ref={pdfRef}
        data-theme={theme} // Asegúrate de que esto esté aquí
        style={{
          position: 'absolute',
          top: '-9999px',
          left: '-9999px',
          width: '210mm',
          height: '297mm',
          background: 'white',
          zIndex: -1000,
          opacity: 0,
          pointerEvents: 'none'
        }}
      >
        <div className="cv-content-a4">
          <div className="cv-basics">
            <h1>{cvData.basics.name}</h1>
            <div className="headline">{cvData.basics.headline}</div>
            <div className="contact-info">
              <div className="contact-item"><i className="fas fa-map-marker-alt"></i>{cvData.basics.location}</div>
              <div className="contact-item"><i className="fas fa-phone"></i>{cvData.basics.phone}</div>
              <div className="contact-item"><i className="fas fa-envelope"></i>{cvData.basics.email}</div>
              <div className="contact-item"><i className="fas fa-link"></i>
                <a href={cvData.basics.url.href} target="_blank" rel="noopener noreferrer">
                  {cvData.basics.url.label}
                </a>
              </div>
            </div>
          </div>

          <div className="cv-layout">
            <div className="cv-column left-column">
              {cvData.layout[0].map(sectionKey => (
                <CVSection key={`pdf-${sectionKey}`} section={cvData.sections[sectionKey]} sectionKey={sectionKey} />
              ))}
            </div>
            <div className="cv-column right-column">
              {cvData.layout[1].map(sectionKey => (
                <CVSection key={`pdf-${sectionKey}`} section={cvData.sections[sectionKey]} sectionKey={sectionKey} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CVViewer;