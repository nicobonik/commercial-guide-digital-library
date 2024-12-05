import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';

// Set the worker source
GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`;


export async function extractTextFromPDF(file) {
  console.log(file);
  const pdf = await getDocument(file).promise;
  const pages = {};
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    pages[i] = textContent.items.map((item) => item.str).join(' ');
  }
  pdf.destroy();
  return pages;
}
