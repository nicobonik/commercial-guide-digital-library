import * as pdfjsLib from 'pdfjs-dist';
// const pdfjsWorker = await import('pdfjs-dist/build/pdf.worker.entry');

pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

export async function extractTextFromPDF(file) {
  console.log(file);
  const pdf = await pdfjsLib.getDocument(file).promise;
  const pages = {};
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    pages[i] = textContent.items.map((item) => item.str).join(' ');
  }
  return pages;
}
