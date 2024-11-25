import React, { useState, useEffect } from 'react';
import SearchBar from './SearchBar';
import Results from './Results';
import LoadingBar from './LoadingBar.js'
import search from '../utils/search';
import buildDatabaseFromFolder from '../db/buildDatabase';
import { PDFLargePreview } from './PDFViewer.js';

const App = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [largePreview, setLargePreview] = useState(false);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    const buildDatabaseOnLoad = async () => {
      setLoading(true);
      try {
        await buildDatabaseFromFolder((progress) => { 
          // Update the progress dynamically
          document.querySelector('.progress').style.width = `${progress}%`;
        });
      } catch (error) {
        console.error('Error building database:', error);
      } finally {
        setLoading(false);
  }
    };
    buildDatabaseOnLoad();
  }, []);

  const handleSearch = async (query) => {
    const searchResults = await search(query, 'exact');
    setResults(searchResults);
  };

  const handleOnViewPDF = async (id, pageNumber) => {
    // console.log("click!");
    // console.log(id + ", " + pageNumber)
    setLargePreview(true);
    setSelected({pdfId: id, pageNum: pageNumber})

  }

  return (
    <div>
      <LoadingBar isLoading={loading}/>
      <SearchBar onSearch={handleSearch} />
      <Results results={results} onViewPDF={handleOnViewPDF} />
      {largePreview && (<PDFLargePreview pdfUrl={selected.pdfId} pdfPage={selected.pageNum}/> )}
    </div>
  );
};

export default App;
