import React, { useEffect, useRef, useState } from 'react';
import { GlobalWorkerOptions, getDocument, TextLayer } from 'pdfjs-dist';
import { Viewer } from '@react-pdf-viewer/core';

GlobalWorkerOptions.workerSrc = 'https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js'

export const PDFPreview = ({ pdfUrl, pdfPage }) => {
    
};

export const PDFLargePreview = ({pdfUrl, pdfPage, onClose}) => {
  const [pages, setPages] = useState([]);
  const pdfPageRef = useRef(null);

  useEffect(() => {
    const loadPdf = async (pdfPage) => {
      try {
        const url = "/pdfs/" + pdfUrl + ".pdf";
        const pdf = await getDocument(url).promise;
        const loadedPages = [];
        console.log(pdfPage);
        const maxPages = Number(pdfPage) + 5;
        for (let i = Math.max(1, Number(pdfPage) - 5); i <= maxPages; i++) { // Limit to 5 pages
          const page = await pdf.getPage(Number(i));
          const viewport = page.getViewport({ scale: 2.5 });

          // Create a container for the canvas and text layer
          const container = document.createElement("div");
          container.style.position = "relative";
          container.style.width = `${viewport.width}px`;
          container.style.height = `${viewport.height}px`;

          // Render the canvas
          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");
          canvas.height = viewport.height;
          canvas.width = viewport.width;
          await page.render({ canvasContext: context, viewport }).promise;
          container.appendChild(canvas);

          // Render the text layer
          const textLayerDiv = document.createElement("div");
          textLayerDiv.className = "textLayer";
          container.appendChild(textLayerDiv);

          const textContent = await page.getTextContent();
          const textLayer = new TextLayer({
            textContentSource: textContent,
            container: textLayerDiv,
            viewport: viewport,
            textDivs: [],
          });
          await textLayer.render().promise;
        //   console.log(textLayer);

          loadedPages.push({
            pageNum: i,
            canvas,
            textLayer,
            viewportWidth: viewport.width,
            viewportHeight: viewport.height,
          });


        }
        setPages(loadedPages);
      } catch (error) {
        console.error("Error loading PDF:", error);
      }
    };

        loadPdf(pdfPage);
    }, [pdfUrl, pdfPage]);

    useEffect(() => {
        if (pdfPageRef.current) {
            pdfPageRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    }, [pages]);
    

  return (
    <div className="pdf-overlay">
      <div className="pdf-header">
        <strong>{}</strong>
        <button className="close-btn" onClick={onClose}>X</button>
      </div>
      <div className="pdf-content">
        {pages.map((page, index) => (
          <img alt={pdfPage} src={page.canvas.toDataURL()} key={index} ref={index+Number(pdfPage-5) === Number(pdfPage) ? pdfPageRef : null} />
        ))}
      </div>

</div>
);
}
