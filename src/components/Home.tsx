import React from 'react';
import { PDF_FILES, PDF_FOLDER_URL } from '../db/buildDatabase';

interface PDF {
    id: string; // Unique identifier for the PDF
    name: string; // Display name for the PDF
    url: string; // URL of the PDF
}

interface PDFListPageProps {
    pdfs: PDF[]; // Array of PDFs
}

const Home: React.FC<PDFListPageProps> = () => {
    const handleViewPDF = (url: string) => {
        window.open(url, '_blank', 'noopener,noreferrer'); // Open PDF in a new tab
    };

    return (
        <div className="pdf-list-page">
            <h1 className="pdf-list-title">PDF Library</h1>
            <ul className="pdf-list">
                {PDF_FILES.map((pdf) => (
                    <li key={pdf} className="pdf-list-item">
                        <div className="pdf-details">
                            <a href={`${PDF_FOLDER_URL}${pdf}`} target="_blank" rel="noopener noreferrer" className="pdf-link">
                                {pdf}
                            </a>
                        </div>
                        <button
                            className="pdf-view-button"
                            onClick={() => handleViewPDF(`${PDF_FOLDER_URL}${pdf}`)}
                        >
                            View
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Home;
