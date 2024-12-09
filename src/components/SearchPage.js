import React, { useEffect, useState } from 'react';
import SearchBar from './SearchBar';
import {loadJSONData, searchFromJSON} from '../utils/JSONSearch';
import Results from './Results';

const Search = () => {
  const [results, setResults] = useState([]);

  const mergeSearchResults = (results1, results2) => {
    // Create a Set of unique keys from results2

    // Filter results1 to only include items present in results2
    return results1.filter(result => {
        const result2 = results2.find(item => item.pdfId === result.pdfId && item.pageNum === result.pageNum);
        if(result2) {
          console.log(result.pdfId + "-" + result.pageNum + ": " + result2.index + ", " + result.index);
          if(Math.abs(result2.index - result.index) < 20) {
            return true;
          }
        }
        return false;
    }
    );
  };

  useEffect(() => {
    loadJSONData('/TextDB-Pages.json');
  }, []);

  const handleSearch = async (query, isExactSearch) => {
    
    const searchResults = await searchFromJSON(query, isExactSearch);
    setResults(searchResults);
  };

  const handleAddressSearch = async(query, addressQuery, isExactSearch) => {
    const searchResults = await searchFromJSON(query, isExactSearch);
    const addressSearchResults = await searchFromJSON(addressQuery, true);

    console.log(searchResults);
    console.log(addressSearchResults);


    const combinedResults = mergeSearchResults(searchResults, addressSearchResults);

    setResults(combinedResults);
  }

  return (
    <div>
      <div className='header'>
        <h1>Advanced Search</h1>
        <p>Search tool created for the Commercial Guide Digital Library</p>
      </div>
      
      <SearchBar onSearch={handleSearch} onSearchAddress={handleAddressSearch} />
      <Results results={results} />
    </div>
  );
};

export default Search;
