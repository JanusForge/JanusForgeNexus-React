import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * 🛰️ EXPORT PROTOCOL
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
      scale: 2, // High DPI for professional printing
      useCORS: true,
      backgroundColor: '#050505', // Maintains the Nexus dark theme
      logging: false,
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${filename}.pdf`);
  } catch (error) {
    console.error("PDF Export Protocol Failed:", error);
  }
};
