import { useState } from 'react';
import { generatePDF } from '../../../utils/pdfGenerator';
import './CVControls.css';

const CVControls = ({
  zoom,
  setZoom,
  theme,
  setTheme,
  language,
  pdfElementRef,
}) => {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const zoomLevels = [80, 100, 120];
  const themes = [
    { id: 'default', name: 'Default', color: '#4a1e8c' },
    { id: 'gray', name: 'Gray', color: '#2d3748' },
    { id: 'blue', name: 'Blue', color: '#1e3a8a' },
    { id: 'green', name: 'Green', color: '#065f46' },
    { id: 'pink', name: 'Pink', color: '#831843' },
  ];

  const handleDownloadPDF = async () => {
    if (isGeneratingPDF) {
      return;
    }

    setIsGeneratingPDF(true);

    try {
      // Usar la referencia del elemento A4
      const element = pdfElementRef.current;

      if (!element) {
        throw new Error('CV PDF element not found');
      }

      console.log(
        'PDF Element found with theme:',
        element.getAttribute('data-theme')
      );
      const filename = `Curriculum_Eduardo_Carrera_${language}`;

      await generatePDF(element, filename, theme);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF: ' + error.message);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <div className="cv-controls">
      <div className="control-group">
        <label>Zoom:</label>
        <div className="zoom-controls">
          {zoomLevels.map((level) => (
            <button
              key={level}
              className={`zoom-btn ${zoom === level ? 'active' : ''}`}
              onClick={() => setZoom(level)}
            >
              {level}%
            </button>
          ))}
        </div>
      </div>

      <div className="control-group">
        <label>Theme:</label>
        <div className="theme-controls">
          {themes.map((themeOption) => (
            <button
              key={themeOption.id}
              className={`theme-btn ${theme === themeOption.id ? 'active' : ''}`}
              onClick={() => setTheme(themeOption.id)}
              style={{ backgroundColor: themeOption.color }}
              title={themeOption.name}
            />
          ))}
        </div>
      </div>

      <button
        className="download-btn"
        onClick={handleDownloadPDF}
        disabled={isGeneratingPDF}
      >
        <img
          src="/eduardocarrera_portfolio/assets/img/icons/icon-download.svg"
          alt="PDF"
          className="download-icon"
        />
        {isGeneratingPDF ? 'Generating...' : 'PDF'}
      </button>
    </div>
  );
};

export default CVControls;
