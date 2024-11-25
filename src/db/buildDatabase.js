import { extractTextFromPDF } from '../utils/pdfUtils';
import { saveTextData } from './indexedDB';

// List all PDF file names in the pdfs/ folder
const PDF_FOLDER_URL = '/pdfs/';
const PDF_FILES = [
  '1876-full.pdf',
  'Mangiarotti-1871.pdf'
  // Add all your filenames here
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
