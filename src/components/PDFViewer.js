import React, { useEffect, useRef, useState } from 'react';
import { getDocument } from 'pdfjs-dist';

export const PDFPreview = ({ pdfUrl, pdfPage }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const canvasRef = useRef(null);
  const renderTaskRef = useRef(null); // Ref to store the current render task

  useEffect(() => {
    const loadPdf = async () => {
      try {
        setLoading(true);
        setError(null);

        // Cancel the previous render task if it's still running
        if (renderTaskRef.current) {
          renderTaskRef.current.cancel();
        }

        // Load the PDF document
        const loadingTask = getDocument(pdfUrl);
        const pdfDocument = await loadingTask.promise;

        // Get the specified page of the document
        // console.log(pdfPage);
        const page = await pdfDocument.getPage(Number(pdfPage));
        const scale = 1.0;
        const viewport = page.getViewport({ scale });

        // Set up the canvas to render the page
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        // Render the page into the canvas
        const renderTask = page.render({ canvasContext: context, viewport });
        renderTaskRef.current = renderTask;

        await renderTask.promise;
        setLoading(false);
      } catch (err) {
        if (err.name === 'RenderingCancelledException') {
          console.log('Rendering cancelled:', err.message);
        } else {
          setError('Error loading PDF: ' + err.message);
        }
        setLoading(false);
      }
    };

    loadPdf();

    // Cleanup function to cancel the render task when component unmounts or updates
    return () => {
      if (renderTaskRef.current) {
        renderTaskRef.current.cancel();
      }
    };
  }, [pdfUrl, pdfPage]); // Re-run when pdfUrl or pdfPage changes

  return (
    <div>
      {loading && <div>Loading preview...</div>}
      {error && <div>{error}</div>}
      <canvas ref={canvasRef} style={{ width: '100%', height: 'auto' }} />
    </div>
  );
};

export const PDFLargePreview = ({pdfUrl, pdfPage}) => {

    const url = pdfUrl + ".pdf&page=" + pdfPage;

    return (
        <iframe src={url} width="100%" height="600px" title='test'>Test</iframe>
    )
   

}
