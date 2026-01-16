import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * 🛰️ EXPORT PROTOCOL (V3 - Final Type-Safe Version)
 * Converts the Janus Forge Synthesis Stage into a high-authority PDF report.
 */
export const exportToPDF = async (elementId: string, filename: string) => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error("Protocol Error: Synthesis Stage element not found.");
    return;
  }

  try {
    const canvas = await html2canvas(element, {
      scale: 2, // High DPI
      useCORS: true,
      backgroundColor: '#050505',
      logging: false,
    });

    const imgData = canvas.toDataURL('image/png');
    
    // Create PDF in 'portrait', 'millimeters', 'a4' format
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    // A4 dimensions are 210mm x 297mm
    const pdfWidth = pdf.internal.pageSize.getWidth();
    
    // Calculate height maintaining the original aspect ratio of the canvas
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const pdfHeight = (imgHeight * pdfWidth) / imgWidth;

    // Add image at coordinates (0, 0) with calculated width and height
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${filename}.pdf`);
  } catch (error) {
    console.error("PDF Export Protocol Failed:", error);
  }
};
