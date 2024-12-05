import { extractTextFromPDF } from '../utils/pdfUtils';
import { saveTextData } from './indexedDB';

// List all PDF file names in the pdfs/ folder
export const PDF_FOLDER_URL = '/pdfs/';
export const PDF_FILES = [
  // Add all your filenames here
  'Mangiarotti 1869.pdf',
  'Mangiarotti 1871.pdf',
  'Mangiarotti 1873.pdf',
  'Mangiarotti 1874.pdf',
  'Mangiarotti 1875.pdf',
  'Mangiarotti 1876.pdf',
  'Mangiarotti 1878.pdf',
  'Mangiarotti 1879.pdf',
  'Mangiarotti 1880.pdf',
  'Mangiarotti 1881.pdf',
  'Mangiarotti 1882.pdf',
  'Mangiarotti 1883.pdf',
  'Mangiarotti 1884.pdf',
  'Mangiarotti 1885.pdf',
  'Mangiarotti 1889.pdf',
  'Mangiarotti 1890.pdf',
  'Mangiarotti 1891.pdf',
  'Mangiarotti 1892.pdf',
  'Mangiarotti 1893.pdf',
  'Mangiarotti 1894.pdf',
  'Mangiarotti 1895.pdf',
  'Mangiarotti 1897.pdf',
  'Mangiarotti 1898.pdf',
  'Mangiarotti 1899.pdf',
  'Mangiarotti 1900.pdf',
  'Mangiarotti 1901.pdf',
  'Mangiarotti 1902.pdf',
  'Mangiarotti 1903.pdf',
  'Mangiarotti 1904.pdf',
  'Mangiarotti 1905.pdf',
  'Mangiarotti 1906.pdf',
  'Mangiarotti 1907.pdf',
  'Mangiarotti 1908.pdf',
  'Mangiarotti 1909.pdf',
  'Mangiarotti 1910.pdf',
  'Mangiarotti 1911.pdf',
  'Mangiarotti 1912.pdf',
  'Mangiarotti 1913.pdf',
];

// Build the database by fetching and processing PDFs
const buildDatabaseFromFolder = async (progressCallback) => {
    const totalPDFs = PDF_FILES.length;
    let currPDF = 0;
    for (const fileName of PDF_FILES) {
        try {
        const pdfUrl = `${PDF_FOLDER_URL}${fileName}`;
        console.log(`Processing: ${pdfUrl}`);
        
        // Fetch the PDF file
        //   const response = await fetch(pdfUrl);
        //   if (!response.ok) throw new Error(`Failed to fetch ${pdfUrl}`);
        
        //   const pdfBlob = await response.blob();

        // Extract text from the PDF
        const pages = await extractTextFromPDF(pdfUrl);

        // Generate a unique ID (based on file name)
        const pdfId = fileName.replace('.pdf', '');

        // Save extracted text into IndexedDB
        await saveTextData(pdfId, pages);

        console.log(`Successfully processed and saved: ${fileName}`);

        const progress = Math.floor(((currPDF+1) / totalPDFs) * 100);
        if (progressCallback) {
            progressCallback(progress);  // Pass the progress percentage
        }

        } catch (error) {
        console.error(`Error processing ${fileName}:`, error);
        }
        currPDF++;
    }

    console.log('All PDFs processed and stored in IndexedDB!');
}

export default buildDatabaseFromFolder;
