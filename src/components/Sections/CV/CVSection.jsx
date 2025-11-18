import './CVSection.css';

const CVSection = ({ section, sectionKey }) => {
  if (!section.visible) {
    return null;
  }

  const renderContent = () => {
    switch (sectionKey) {
      case 'summary':
        return (
          <div
            className="summary-content"
            dangerouslySetInnerHTML={{ __html: section.content }}
          />
        );

      case 'experience':
      case 'education':
      case 'achievements':
        return section.items.map((item, index) => (
          <div key={index} className={`${sectionKey}-item`}>
            {renderSectionItem(item, sectionKey)}
          </div>
        ));

      case 'languages':
        return section.items.map((item, index) => (
          <div key={index} className="language-item">
            <strong>{item.name}:</strong> {item.description}
          </div>
        ));

      case 'skills':
        return section.items.map((category, index) => (
          <div key={index} className="skills-category">
            <h4>{category.name}</h4>
            <div className="keywords">
              {category.keywords.map((keyword, idx) => (
                <span key={idx} className="keyword">
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        ));

      case 'tools':
        return (
          <div className="keywords">
            {section.keywords.map((tool, index) => (
              <span key={index} className="keyword">
                {tool}
              </span>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  const renderSectionItem = (item, type) => {
    switch (type) {
      case 'experience':
        return (
          <>
            <div className="item-header">
              <div className="item-title">{item.position}</div>
              <div className="item-meta">
                {item.company} | {item.date} | {item.location}
              </div>
              {item.url && (
                <div className="item-url">
                  <a href={item.url} target="_blank" rel="noopener noreferrer">
                    {item.url.replace(/^https?:\/\//, '')}
                  </a>
                </div>
              )}
            </div>
            <div
              className="item-content"
              dangerouslySetInnerHTML={{ __html: item.summary }}
            />
          </>
        );

      case 'education':
        return (
          <>
            <div className="item-header">
              <div className="item-title">{item.institution}</div>
              <div className="item-meta">{item.date}</div>
            </div>
            <div className="item-subtitle">{item.studyType}</div>
            <div className="item-content">{item.area}</div>
          </>
        );

      case 'achievements':
        return (
          <>
            <h4>{item.name}</h4>
            <div
              className="item-content"
              dangerouslySetInnerHTML={{ __html: item.summary }}
            />
          </>
        );

      default:
        return null;
    }
  };

  return (
    <section className={`cv-section ${sectionKey}`}>
      <h3>{section.name}</h3>
      <div className="section-content">{renderContent()}</div>
    </section>
  );
};

export default CVSection;
