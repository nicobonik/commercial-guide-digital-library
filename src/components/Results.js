import React from 'react';
import { PDFPreview } from './PDFViewer';

const Results = ({ results, onViewPDF }) => (
  <div>
    <h3>Search Results</h3>
    <div className='results-grid'>
      {results.map((result, index) => (
        
           <div key={`${result.pdfId}-${result.pageNum}`} className='result-item' onClick={() => onViewPDF(result.pdfId, result.pageNum)}>
            <strong>Document:</strong> {result.pdfId}, <strong>Page:</strong> {result.pageNum}
            <PDFPreview 
            pdfUrl={`/pdfs/${result.pdfId}.pdf`} 
            pdfPage={result.pageNum}
            />
          </div>
      ))}
      </div>
  </div>
);

export default Results;