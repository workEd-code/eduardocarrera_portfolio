/**
 * MAIN.JS - Controlador principal del portafolio (Versión Final)
 * 
 * Funcionalidades:
 * - Sistema multiidioma (EN/ES) con inglés por defecto
 * - Animación de typing para título y fade-in para descripción
 * - Descarga de CV según idioma
 * - Carga dinámica de categorías y proyectos desde JSON
 * - Navegación por categorías con animaciones
 * - Efectos de hover dinámicos
 * - Diseño completamente responsive
 */

// Variables globales
let currentLanguage = 'en'; // Inglés por defecto
let categoriesData = {};
let translationsData = {};
let currentCategoryIndex = 0;

// Inicialización cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    initLightEffect();
    loadTranslations();
    initDownloadCV();
    initLanguageSwitcher();
});

/**
 * Efecto de luz que sigue al cursor
 */
function initLightEffect() {
    const lightEffect = document.getElementById('light-effect');
    
    document.addEventListener('mousemove', function(e) {
        lightEffect.style.left = e.clientX + 'px';
        lightEffect.style.top = e.clientY + 'px';
    });
    
    // Ocultar efecto en dispositivos táctiles
    document.addEventListener('touchstart', function() {
        lightEffect.style.opacity = '0';
    });
    
    document.addEventListener('touchend', function() {
        lightEffect.style.opacity = '0';
    });
}

/**
 * Carga las traducciones y luego los datos del portafolio
 */
function loadTranslations() {
    fetch('assets/data/translations.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al cargar las traducciones');
            }
            return response.json();
        })
        .then(translations => {
            translationsData = translations;
            updateUIForLanguage(currentLanguage);
            loadPortfolioData();
        })
        .catch(error => {
            console.error('Error cargando traducciones:', error);
            // Cargar datos aunque falle las traducciones
            loadPortfolioData();
        });
}

/**
 * Carga los datos del portafolio
 */
function loadPortfolioData() {
    const categoriesContainer = document.getElementById('categories-nav');
    const projectsContainer = document.getElementById('projects-grid');
    
    // Mostrar estado de carga
    categoriesContainer.innerHTML = '<div class="loading">' + 
        (translationsData[currentLanguage]?.loading || 'Loading...') + '</div>';
    projectsContainer.innerHTML = '<div class="loading">' + 
        (translationsData[currentLanguage]?.loadingProjects || 'Loading projects...') + '</div>';
    
    fetch('assets/data/projects.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al cargar los proyectos');
            }
            return response.json();
        })
        .then(data => {
            categoriesData = data;
            createCategoryButtons(data.categories);
            if (data.categories.length > 0) {
                displayProjectsByCategory(0);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            const errorMsg = translationsData[currentLanguage]?.error || 'Error loading data';
            categoriesContainer.innerHTML = '<p>' + errorMsg + '</p>';
            projectsContainer.innerHTML = '<p>' + errorMsg + '</p>';
        });
}

/**
 * Inicializa el selector de idioma
 */
function initLanguageSwitcher() {
    const langButtons = document.querySelectorAll('.lang-btn');
    
    langButtons.forEach(button => {
        button.addEventListener('click', function() {
            const selectedLang = this.getAttribute('data-lang');
            
            // Actualizar botones activos
            langButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Actualizar idioma
            currentLanguage = selectedLang;
            updateUIForLanguage(selectedLang);
            
            // Actualizar proyectos para la categoría actual
            if (categoriesData.categories && categoriesData.categories.length > 0) {
                displayProjectsByCategory(currentCategoryIndex);
            }
        });
    });
}

/**
 * Reinicia las animaciones del título y descripción
 */
function restartAnimations() {
    const titleElement = document.getElementById('about-title');
    const descriptionElement = document.getElementById('about-description');
    
    // Reiniciar animación del título
    titleElement.style.animation = 'none';
    setTimeout(() => {
        titleElement.style.animation = 'typing 2s steps(30, end) forwards, blink-caret 0.75s step-end infinite';
    }, 10);
    
    // Reiniciar animación de la descripción
    descriptionElement.style.animation = 'none';
    setTimeout(() => {
        descriptionElement.style.animation = 'fade-in 1.5s ease-in-out 2s forwards';
    }, 10);
}

/**
 * Actualiza toda la UI para el idioma seleccionado
 */
function updateUIForLanguage(lang) {
    const langData = translationsData[lang];
    if (!langData) return;
    
    // Actualizar sección "Sobre Mí"
    const titleElement = document.getElementById('about-title');
    const descriptionElement = document.getElementById('about-description');
    
    titleElement.textContent = langData.about.title;
    descriptionElement.textContent = langData.about.description;
    
    // Reiniciar animaciones
    restartAnimations();
    
    // Actualizar textos de botones
    document.getElementById('contact-text').textContent = langData.about.contact;
    document.getElementById('contact-text-whatsapp').textContent = langData.about.contact;
    document.getElementById('download-text').textContent = langData.about.download;
    
    // Actualizar título de proyectos
    document.getElementById('projects-title').textContent = langData.projects.title;
    
    // Actualizar categorías si ya están cargadas
    updateCategoryButtonsLanguage(lang);
}

/**
 * Actualiza los textos de los botones de categorías
 */
function updateCategoryButtonsLanguage(lang) {
    const langData = translationsData[lang];
    if (!langData || !categoriesData.categories) return;
    
    document.querySelectorAll('.category-btn').forEach((btn, index) => {
        const categoryId = btn.getAttribute('data-category');
        const categoryName = langData.categories[categoryId];
        if (categoryName) {
            btn.querySelector('span:last-child').textContent = categoryName;
        }
    });
}

/**
 * Crea los botones de categorías con íconos SVG
 */
function createCategoryButtons(categories) {
    const container = document.getElementById('categories-nav');
    container.innerHTML = '';
    
    categories.forEach((category, index) => {
        const button = document.createElement('button');
        button.className = `category-btn ${index === 0 ? 'active' : ''}`;
        button.setAttribute('data-category', category.id);
        button.setAttribute('data-index', index);
        
        // Crear contenedor de ícono SVG
        const svgIcon = document.createElement('div');
        svgIcon.className = 'category-icon';
        svgIcon.innerHTML = `<img src="${category.icon}" alt="${category.id} icon">`;
        
        // Crear texto de la categoría
        const textSpan = document.createElement('span');
        const categoryName = translationsData[currentLanguage]?.categories[category.id] || category.id;
        textSpan.textContent = categoryName;
        
        button.appendChild(svgIcon);
        button.appendChild(textSpan);
        
        button.addEventListener('click', function() {
            const newIndex = parseInt(this.getAttribute('data-index'));
            currentCategoryIndex = newIndex;
            
            // Actualizar categoría activa
            document.querySelectorAll('.category-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            this.classList.add('active');
            
            displayProjectsByCategory(newIndex);
        });
        
        container.appendChild(button);
    });
}

/**
 * Muestra los proyectos de una categoría específica
 */
function displayProjectsByCategory(categoryIndex) {
    const projectsContainer = document.getElementById('projects-grid');
    const category = categoriesData.categories[categoryIndex];
    
    if (!category || !category.projects) {
        const noProjectsMsg = translationsData[currentLanguage]?.noProjects || 'No projects in this category.';
        projectsContainer.innerHTML = `<p>${noProjectsMsg}</p>`;
        return;
    }
    
    // Aplicar animación de salida
    projectsContainer.classList.add('slide-left');
    
    setTimeout(() => {
        projectsContainer.innerHTML = '';
        
        category.projects.forEach(project => {
            const projectElement = createProjectElement(project);
            projectsContainer.appendChild(projectElement);
        });
        
        projectsContainer.classList.remove('slide-left');
    }, 200);
}

/**
 * Crea el elemento HTML para un proyecto individual
 */
function createProjectElement(project) {
    const projectCard = document.createElement('div');
    projectCard.className = 'project-card';
    
    // Obtener descripción en el idioma actual
    const description = project.description[currentLanguage] || project.description.en || [];
    
    let projectHTML = `
        <h3 class="project-title">${project.name}</h3>
        <div class="project-description">
            <ul class="description-list">
    `;
    
    // Añadir cada punto de la descripción
    description.forEach(desc => {
        projectHTML += `<li class="description-item">${desc}</li>`;
    });
    
    projectHTML += `</ul></div>`;
    
    // Añadir tecnologías
    if (project.technologies && project.technologies.length > 0) {
        projectHTML += `<div class="project-tech">`;
        project.technologies.forEach(tech => {
            projectHTML += `<span class="tech-tag">${tech}</span>`;
        });
        projectHTML += `</div>`;
    }
    
    // Añadir enlaces
    if (project.links) {
        const viewDemoText = currentLanguage === 'en' ? 'View Demo' : 'Ver Demo';
        const viewCodeText = currentLanguage === 'en' ? 'View Code' : 'Ver Código';
        
        projectHTML += `<div class="project-links">`;
        for (const [type, url] of Object.entries(project.links)) {
            const linkText = type === 'demo' ? viewDemoText : viewCodeText;
            const icon = type === 'demo' ? '🔍' : '💻';
            projectHTML += `<a href="${url}" class="project-link" target="_blank" rel="noopener">
                <span>${icon}</span>
                <span>${linkText}</span>
            </a>`;
        }
        projectHTML += `</div>`;
    }
    
    projectCard.innerHTML = projectHTML;
    return projectCard;
}

/**
 * Inicializa la funcionalidad de descarga del CV según idioma
 */
function initDownloadCV() {
    const downloadBtn = document.getElementById('download-cv');
    
    downloadBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Definir la ruta del CV basado en el idioma actual
        const cvPath = currentLanguage === 'en' 
            ? './assets/docs/cv_eduardo_carrera_en.pdf'
            : './assets/docs/cv_eduardo_carrera_es.pdf';
        
        // Crear un enlace temporal para iniciar la descarga
        const link = document.createElement('a');
        link.href = cvPath;
        link.download = currentLanguage === 'en' ? 'Eduardo_Carrera_CV_EN.pdf' : 'Eduardo_Carrera_CV_ES.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
}