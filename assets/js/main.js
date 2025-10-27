/**
 * MAIN.JS - Controlador principal del portafolio (Versión Final)
 * 
 * Nuevas funcionalidades:
 * - Elementos flotantes solo en sección de proyectos
 * - Iluminación de ícono de categoría activa
 * - Menú de categorías para móviles
 * - Sistema de fondos personalizados para proyectos
 * 
 * Funcionalidades existentes:
 * - Sistema multiidioma (EN/ES) con inglés por defecto
 * - Animación de typing para título y fade-in para descripción
 * - Descarga de CV según idioma
 * - Carga dinámica de categorías y proyectos desde JSON
 * - Scroll animado entre proyectos
 * - Círculo de progreso para móviles
 */

// Variables globales
let currentLanguage = 'en'; // Inglés por defecto
let categoriesData = {};
let translationsData = {};
let currentCategoryIndex = 0;
let currentProjectIndex = 0;
let isScrolling = false;
let activeCategoryId = null;

// Inicialización cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    initLightEffect();
    loadTranslations();
    initDownloadCV();
    initLanguageSwitcher();
    initScrollSystem();
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
    const floatingContainer = document.getElementById('floating-categories');
    const mobileContainer = document.getElementById('mobile-categories-nav');
    const projectsContainer = document.getElementById('projects-scroll-container');
    
    // Mostrar estado de carga
    floatingContainer.innerHTML = '<div class="loading">' + 
        (translationsData[currentLanguage]?.loading || 'Loading...') + '</div>';
    mobileContainer.innerHTML = '<div class="loading">' + 
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
            createFloatingCategories(data.categories);
            createMobileCategories(data.categories);
            if (data.categories.length > 0) {
                displayAllProjects(data.categories);
                initScrollObserver();
                initMobileProgress();
            }
        })
        .catch(error => {
            console.error('Error:', error);
            const errorMsg = translationsData[currentLanguage]?.error || 'Error loading data';
            floatingContainer.innerHTML = '<p>' + errorMsg + '</p>';
            mobileContainer.innerHTML = '<p>' + errorMsg + '</p>';
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
                updateProjectsLanguage();
                updateFloatingCategoriesLanguage();
                updateMobileCategoriesLanguage();
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
    updateFloatingCategoriesLanguage(lang);
    updateMobileCategoriesLanguage(lang);
}

/**
 * Actualiza los textos de los elementos flotantes
 */
function updateFloatingCategoriesLanguage(lang = currentLanguage) {
    const langData = translationsData[lang];
    if (!langData || !categoriesData.categories) return;
    
    document.querySelectorAll('.floating-category').forEach((element, index) => {
        const categoryId = element.getAttribute('data-category');
        const categoryName = langData.categories[categoryId];
        if (categoryName) {
            const bubble = element.querySelector('.category-bubble');
            // Limitar a 2 palabras máximo por línea
            const words = categoryName.split(' ');
            if (words.length > 2) {
                bubble.innerHTML = words.slice(0, 2).join(' ') + '<br>' + words.slice(2).join(' ');
            } else {
                bubble.textContent = categoryName;
            }
        }
    });
}

/**
 * Actualiza los textos de los elementos móviles
 */
function updateMobileCategoriesLanguage(lang = currentLanguage) {
    // Los elementos móviles solo muestran íconos, no necesitan actualización de texto
}

/**
 * Actualiza el lenguaje de todos los proyectos
 */
function updateProjectsLanguage() {
    const projectSlides = document.querySelectorAll('.project-slide');
    projectSlides.forEach(slide => {
        const projectName = slide.getAttribute('data-project-name');
        const categoryId = slide.getAttribute('data-category');
        
        // Encontrar el proyecto en los datos
        const category = categoriesData.categories.find(cat => cat.id === categoryId);
        if (category) {
            const project = category.projects.find(proj => proj.name === projectName);
            if (project) {
                updateProjectSlideContent(slide, project);
            }
        }
    });
}

/**
 * Actualiza el contenido de un slide de proyecto según el idioma
 */
function updateProjectSlideContent(slideElement, project) {
    const description = project.description[currentLanguage] || project.description.en || [];
    
    // Actualizar descripción
    const descriptionList = slideElement.querySelector('.description-list');
    descriptionList.innerHTML = '';
    
    description.forEach(desc => {
        const li = document.createElement('li');
        li.className = 'description-item';
        li.textContent = desc;
        descriptionList.appendChild(li);
    });
}

/**
 * Crea los elementos flotantes de categorías
 */
function createFloatingCategories(categories) {
    const container = document.getElementById('floating-categories');
    container.innerHTML = '';
    
    categories.forEach((category, index) => {
        const categoryElement = document.createElement('div');
        categoryElement.className = 'floating-category';
        categoryElement.setAttribute('data-category', category.id);
        categoryElement.setAttribute('data-index', index);
        
        // Crear contenedor del ícono
        const iconDiv = document.createElement('div');
        iconDiv.className = 'floating-icon';
        iconDiv.innerHTML = `<img src="${category.icon}" alt="${category.id} icon">`;
        
        // Crear burbuja de texto
        const bubbleDiv = document.createElement('div');
        bubbleDiv.className = 'category-bubble';
        const categoryName = translationsData[currentLanguage]?.categories[category.id] || category.id;
        // Limitar a 2 palabras máximo por línea
        const words = categoryName.split(' ');
        if (words.length > 2) {
            bubbleDiv.innerHTML = words.slice(0, 2).join(' ') + '<br>' + words.slice(2).join(' ');
        } else {
            bubbleDiv.textContent = categoryName;
        }
        
        categoryElement.appendChild(iconDiv);
        categoryElement.appendChild(bubbleDiv);
        
        categoryElement.addEventListener('click', function() {
            const categoryIndex = parseInt(this.getAttribute('data-index'));
            navigateToCategory(categoryIndex);
        });
        
        container.appendChild(categoryElement);
    });
}

/**
 * Crea el menú de categorías para móviles
 */
function createMobileCategories(categories) {
    const container = document.getElementById('mobile-categories-nav');
    container.innerHTML = '';
    
    categories.forEach((category, index) => {
        const categoryElement = document.createElement('button');
        categoryElement.className = 'mobile-category-btn';
        categoryElement.setAttribute('data-category', category.id);
        categoryElement.setAttribute('data-index', index);
        categoryElement.setAttribute('title', translationsData[currentLanguage]?.categories[category.id] || category.id);
        
        categoryElement.innerHTML = `<img src="${category.icon}" alt="${category.id} icon">`;
        
        categoryElement.addEventListener('click', function() {
            const categoryIndex = parseInt(this.getAttribute('data-index'));
            navigateToCategory(categoryIndex);
        });
        
        container.appendChild(categoryElement);
    });
}

/**
 * Navega a una categoría específica
 */
function navigateToCategory(categoryIndex) {
    const category = categoriesData.categories[categoryIndex];
    if (!category) return;
    
    // Encontrar el primer proyecto de esta categoría
    const firstProjectSlide = document.querySelector(`.project-slide[data-category="${category.id}"]`);
    if (firstProjectSlide) {
        smoothScrollToElement(firstProjectSlide);
    }
    
    currentCategoryIndex = categoryIndex;
    setActiveCategory(category.id);
}

/**
 * Establece la categoría activa en todos los menús
 */
function setActiveCategory(categoryId) {
    activeCategoryId = categoryId;
    
    // Remover clase activa de todos los elementos
    document.querySelectorAll('.floating-category, .mobile-category-btn').forEach(el => {
        el.classList.remove('active');
    });
    
    // Agregar clase activa a los elementos de la categoría actual
    const activeFloating = document.querySelector(`.floating-category[data-category="${categoryId}"]`);
    const activeMobile = document.querySelector(`.mobile-category-btn[data-category="${categoryId}"]`);
    
    if (activeFloating) activeFloating.classList.add('active');
    if (activeMobile) activeMobile.classList.add('active');
}

/**
 * Desplazamiento suave a un elemento
 */
function smoothScrollToElement(element) {
    const scrollContainer = document.getElementById('projects-scroll-container');
    const elementTop = element.offsetTop;
    
    scrollContainer.scrollTo({
        top: elementTop,
        behavior: 'smooth'
    });
}

/**
 * Muestra todos los proyectos organizados por categorías
 */
function displayAllProjects(categories) {
    const container = document.getElementById('projects-scroll-container');
    container.innerHTML = '';
    
    let totalProjects = 0;
    
    categories.forEach(category => {
        if (category.projects && category.projects.length > 0) {
            category.projects.forEach(project => {
                const projectElement = createProjectSlide(project, category.id);
                container.appendChild(projectElement);
                totalProjects++;
            });
        }
    });
    
    // Si no hay proyectos, mostrar mensaje
    if (totalProjects === 0) {
        const noProjectsMsg = translationsData[currentLanguage]?.noProjects || 'No projects available.';
        container.innerHTML = `<div class="loading">${noProjectsMsg}</div>`;
    }
}

/**
 * Crea un slide de proyecto para el scroll animado
 */
function createProjectSlide(project, categoryId) {
    const projectSlide = document.createElement('div');
    projectSlide.className = 'project-slide';
    projectSlide.setAttribute('data-project-name', project.name);
    projectSlide.setAttribute('data-category', categoryId);
    
    // Aplicar fondo personalizado si existe
    if (project.background) {
        projectSlide.style.setProperty('--project-background', project.background);
        projectSlide.setAttribute('data-background', 'true');
    }
    
    // Obtener descripción en el idioma actual
    const description = project.description[currentLanguage] || project.description.en || [];
    
    let projectHTML = `
        <div class="project-slide-content">
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
    
    projectHTML += `</div></div>`;
    projectSlide.innerHTML = projectHTML;
    
    return projectSlide;
}

/**
 * Inicializa el sistema de scroll animado
 */
function initScrollSystem() {
    const scrollContainer = document.getElementById('projects-scroll-container');
    
    // Prevenir scroll rápido múltiple
    scrollContainer.addEventListener('scroll', function() {
        if (!isScrolling) {
            isScrolling = true;
            setTimeout(() => {
                isScrolling = false;
            }, 500);
        }
    });
    
    // Actualizar progreso de scroll para desktop
    scrollContainer.addEventListener('scroll', updateScrollProgress);
}

/**
 * Inicializa el Intersection Observer para detectar proyectos visibles
 */
function initScrollObserver() {
    const options = {
        root: document.getElementById('projects-scroll-container'),
        rootMargin: '0px',
        threshold: 0.6 // 60% visible
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const projectSlide = entry.target;
                projectSlide.classList.add('active');
                
                // Actualizar categoría activa basado en el proyecto visible
                const categoryId = projectSlide.getAttribute('data-category');
                setActiveCategory(categoryId);
            } else {
                entry.target.classList.remove('active');
            }
        });
    }, options);
    
    // Observar todos los slides de proyectos
    document.querySelectorAll('.project-slide').forEach(slide => {
        observer.observe(slide);
    });
}

/**
 * Actualiza la barra de progreso del scroll para desktop
 */
function updateScrollProgress() {
    const scrollContainer = document.getElementById('projects-scroll-container');
    const progressBar = document.querySelector('.progress-bar');
    
    const scrollTop = scrollContainer.scrollTop;
    const scrollHeight = scrollContainer.scrollHeight - scrollContainer.clientHeight;
    const scrollPercentage = (scrollTop / scrollHeight) * 100;
    
    progressBar.style.height = `${scrollPercentage}%`;
}

/**
 * Inicializa el círculo de progreso para móviles
 */
function initMobileProgress() {
    const mobileProgress = document.getElementById('mobile-progress');
    const progressCircle = mobileProgress.querySelector('.progress-ring-circle');
    const progressText = mobileProgress.querySelector('.progress-text');
    const scrollContainer = document.getElementById('projects-scroll-container');
    
    const circumference = 2 * Math.PI * 27; // radio del círculo
    progressCircle.style.strokeDasharray = circumference;
    
    function updateMobileProgress() {
        const scrollTop = scrollContainer.scrollTop;
        const scrollHeight = scrollContainer.scrollHeight - scrollContainer.clientHeight;
        const scrollPercentage = (scrollTop / scrollHeight) * 100;
        
        const offset = circumference - (scrollPercentage / 100) * circumference;
        progressCircle.style.strokeDashoffset = offset;
        progressText.textContent = Math.round(scrollPercentage) + '%';
        
        // Si llegamos al final, cambiar a botón de volver al inicio
        if (scrollPercentage >= 99) {
            mobileProgress.classList.add('back-to-top');
            progressText.textContent = '↑';
        } else {
            mobileProgress.classList.remove('back-to-top');
        }
    }
    
    scrollContainer.addEventListener('scroll', updateMobileProgress);
    
    // Click en el círculo para volver al inicio
    mobileProgress.addEventListener('click', function() {
        if (this.classList.contains('back-to-top')) {
            // Volver al inicio de los proyectos
            scrollContainer.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    });
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