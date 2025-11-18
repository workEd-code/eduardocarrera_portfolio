import { useLanguage } from '../../context/LanguageContext';
import './About.css';

const About = () => {
  const { t } = useLanguage();

  return (
    <section className="about-section">
      <div className="profile">
        <div className="profile-image-container">
          <div className="profile-image">
            <img
              src="/eduardocarrera_portfolio/assets/img/profile.png"
              alt="Eduardo Carrera"
              className="protected-image"
            />
          </div>
        </div>
        <div className="profile-info">
          <h2 id="about-title" className="typing-title">
            {t('about.title')}
          </h2>
          <div id="about-description" className="fade-in-description">
            {t('about.description')}
          </div>
          <div className="contact-buttons">
            <a href="mailto:wrkedc@gmail.com" className="btn contact-btn">
              <div className="btn-icon">
                <img
                  src="/eduardocarrera_portfolio/assets/img/icons/icon-email.svg"
                  alt="Email"
                />
              </div>
              <span>{t('about.contact')}</span>
            </a>
            <a
              href="https://wa.me/526141007581"
              className="btn contact-btn"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="btn-icon">
                <img
                  src="/eduardocarrera_portfolio/assets/img/icons/icon-whatsapp.svg"
                  alt="WhatsApp"
                />
              </div>
              <span>{t('about.contact')}</span>
            </a>
            <a
              href="https://www.linkedin.com/in/eduardo-carrera-dev"
              className="btn contact-btn"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="btn-icon">
                <img
                  src="/eduardocarrera_portfolio/assets/img/icons/icon-linkedin.svg"
                  alt="LinkedIn"
                />
              </div>
              <span>{t('about.linkedin')}</span>
            </a>
            <a href="/eduardocarrera_portfolio/cv" className="btn contact-btn">
              <div className="btn-icon">
                <img
                  src="/eduardocarrera_portfolio/assets/img/icons/icon-download.svg"
                  alt="CV"
                />
              </div>
              <span>{t('about.download')}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
