import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const generatePDF = async (element, filename, theme = 'default') => {
  try {
    console.log('Starting PDF generation with theme:', theme);

    // Ocultar controles antes de generar PDF
    const controls = document.querySelector('.cv-controls');
    const navigation = document.querySelector('.cv-navigation');
    const originalControlsDisplay = controls?.style.display;
    const originalNavDisplay = navigation?.style.display;

    if (controls) {
      controls.style.display = 'none';
    }
    if (navigation) {
      navigation.style.display = 'none';
    }

    // Guardar estilos originales del elemento A4
    const originalStyles = {
      position: element.style.position,
      top: element.style.top,
      left: element.style.left,
      opacity: element.style.opacity,
      zIndex: element.style.zIndex,
      display: element.style.display,
    };

    // Aplicar el tema actual al elemento A4
    element.setAttribute('data-theme', theme);

    // Hacer visible temporalmente el elemento A4
    element.style.position = 'fixed';
    element.style.top = '0';
    element.style.left = '0';
    element.style.opacity = '1';
    element.style.zIndex = '10000';
    element.style.display = 'block';

    // Esperar a que se renderice
    await new Promise((resolve) => setTimeout(resolve, 500));

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: true,
      backgroundColor: '#ffffff',
      width: 794, // 210mm en pixels
      height: 1123, // 297mm en pixels
      scrollX: 0,
      scrollY: 0,
      windowWidth: 794,
      windowHeight: 1123,
      onclone: (clonedDoc) => {
        // Asegurar que el elemento clonado sea visible y tenga el tema correcto
        const clonedElement = clonedDoc.querySelector('.cv-a4-pdf');
        if (clonedElement) {
          clonedElement.style.position = 'fixed';
          clonedElement.style.top = '0';
          clonedElement.style.left = '0';
          clonedElement.style.opacity = '1';
          clonedElement.style.zIndex = '10000';
          clonedElement.style.display = 'block';
          clonedElement.style.background = '#ffffff';
          clonedElement.style.width = '794px';
          clonedElement.style.height = '1123px';
          // Aplicar el tema al elemento clonado también
          clonedElement.setAttribute('data-theme', theme);
        }

        // Aplicar solo estilos estructurales (sin colores) - MÁRGENES REDUCIDOS
        const styles = `
          .cv-a4-pdf {
            width: 794px !important;
            height: 1123px !important;
            background: white !important;
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            z-index: 10000 !important;
            opacity: 1 !important;
            display: block !important;
          }
          
          .cv-content-a4 {
            width: 100% !important;
            height: 100% !important;
            padding: 2px !important; /* MÁRGENES REDUCIDOS A 2px */
            background: white !important;
            color: #000000 !important;
            font-size: 12px !important;
            line-height: 1.2 !important;
            font-family: 'Lato', Arial, sans-serif !important;
            box-sizing: border-box !important;
          }

          .cv-content-a4 .cv-layout {
            display: grid !important;
            grid-template-columns: 2fr 1fr !important;
            gap: 10px !important; /* Reducido de 15px */
          }

          .cv-content-a4 .cv-basics {
            text-align: left !important;
            margin-bottom: 15px !important; /* Reducido de 20px */
            padding-bottom: 0 !important; /* Eliminado padding bottom */
            border-bottom: none !important; /* ELIMINADA LÍNEA DIVISORA */
          }

          .cv-content-a4 .cv-basics h1 {
            font-size: 22px !important;
            margin-bottom: 3px !important; /* Reducido de 5px */
            line-height: 1.1 !important;
            font-weight: 700 !important;
          }

          .cv-content-a4 .headline {
            font-size: 14px !important;
            margin-bottom: 8px !important; /* Reducido de 10px */
            font-weight: 600 !important;
            line-height: 1.1 !important;
          }

          .cv-content-a4 .contact-info {
            display: flex !important;
            flex-wrap: wrap !important;
            gap: 8px !important; /* Reducido de 10px */
            font-size: 11px !important;
            line-height: 1 !important;
          }

          .cv-content-a4 .contact-item i {
            font-size: 10px !important;
            width: 12px !important;
          }

          .cv-content-a4 .cv-section {
            margin-bottom: 10px !important; /* Reducido de 12px */
          }

          .cv-content-a4 .cv-section h3 {
            font-size: 14px !important;
            border-bottom: 1px solid !important;
            padding-bottom: 2px !important; /* Reducido de 3px */
            margin-bottom: 4px !important; /* Reducido de 6px */
            font-weight: 600 !important;
            line-height: 1.1 !important;
          }

          .cv-content-a4 .section-content {
            font-size: 11px !important;
            line-height: 1.2 !important;
          }

          .cv-content-a4 .experience-item,
          .cv-content-a4 .education-item,
          .cv-content-a4 .achievements-item {
            margin-bottom: 6px !important; /* Reducido de 8px */
          }

          .cv-content-a4 .item-title {
            font-size: 12px !important;
            font-weight: 600 !important;
            margin-bottom: 1px !important; /* Reducido de 2px */
            line-height: 1.1 !important;
          }

          .cv-content-a4 .item-meta {
            font-size: 10px !important;
            color: #000000 !important;
            margin: 0.5px 0 !important; /* Reducido de 1px */
            line-height: 1.1 !important;
          }

          .cv-content-a4 .item-content {
            font-size: 10px !important;
            line-height: 1.2 !important;
            margin-top: 2px !important; /* Reducido de 3px */
          }

          .cv-content-a4 .item-content ul {
            padding-left: 12px !important; /* Reducido de 15px */
            margin: 2px 0 !important; /* Reducido de 3px */
          }

          .cv-content-a4 .item-content li {
            margin-bottom: 1px !important; /* Reducido de 2px */
            line-height: 1.2 !important;
          }

          .cv-content-a4 .keywords {
            display: flex !important;
            flex-wrap: wrap !important;
            gap: 4px !important; /* Reducido de 5px */
          }

          .cv-content-a4 .keyword {
            background: #f5f5f5 !important;
            padding: 1px 4px !important; /* Reducido de 2px 6px */
            border-radius: 6px !important; /* Reducido de 8px */
            font-size: 9px !important;
            border-left: 2px solid !important;
            line-height: 1 !important;
          }

          .cv-content-a4 .summary-content {
            font-size: 11px !important;
            line-height: 1.2 !important;
            text-align: justify !important;
          }

          .cv-content-a4 .summary-content p {
            margin-bottom: 3px !important; /* Reducido de 5px */
            line-height: 1.2 !important;
          }

          .cv-content-a4 .summary-content strong,
          .cv-content-a4 .item-content strong {
            font-weight: 700 !important;
          }

          .cv-content-a4 .achievements-item h4 {
            font-size: 12px !important;
            font-weight: 600 !important;
            margin-bottom: 2px !important; /* Reducido de 3px */
            line-height: 1.1 !important;
          }

          .cv-content-a4 .language-item {
            font-size: 11px !important;
            margin-bottom: 2px !important; /* Reducido de 3px */
            line-height: 1.2 !important;
          }

          .cv-content-a4 .language-item strong {
            font-weight: 600 !important;
          }

          .cv-content-a4 .skills-category {
            margin-bottom: 6px !important; /* Reducido de 8px */
          }

          .cv-content-a4 .skills-category h4 {
            font-size: 12px !important;
            font-weight: 600 !important;
            margin-bottom: 2px !important; /* Reducido de 3px */
            line-height: 1.1 !important;
          }
        `;

        const styleElement = clonedDoc.createElement('style');
        styleElement.textContent = styles;
        clonedDoc.head.appendChild(styleElement);
      },
    });

    console.log(
      'Canvas created with dimensions:',
      canvas.width,
      'x',
      canvas.height
    );

    const imgData = canvas.toDataURL('image/jpeg', 0.95);

    // Crear PDF A4
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    // Calcular dimensiones para que ocupe toda la página
    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;

    console.log('PDF dimensions:', pdfWidth, 'x', pdfHeight);
    console.log('Image dimensions in PDF:', imgWidth, 'x', imgHeight);

    // Añadir imagen al PDF
    pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);

    console.log('PDF generated successfully with theme:', theme);

    // Guardar PDF
    pdf.save(`${filename}.pdf`);

    // Restaurar estilos originales del elemento A4
    Object.keys(originalStyles).forEach((key) => {
      element.style[key] = originalStyles[key];
    });

    // Restaurar controles y navegación
    if (controls) {
      controls.style.display = originalControlsDisplay || 'flex';
    }
    if (navigation) {
      navigation.style.display = originalNavDisplay || 'block';
    }

    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);

    // Restaurar controles en caso de error
    const controls = document.querySelector('.cv-controls');
    const navigation = document.querySelector('.cv-navigation');
    if (controls) {
      controls.style.display = 'flex';
    }
    if (navigation) {
      navigation.style.display = 'block';
    }

    throw error;
  }
};
