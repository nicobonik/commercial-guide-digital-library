import React, { useEffect, useState } from 'react';
import SearchBar from './SearchBar';
import {loadJSONData, searchFromJSON} from '../utils/JSONSearch';
import Results from './Results';

const Search = () => {
  const [results, setResults] = useState([]);


  useEffect(() => {
    loadJSONData('/TextDB-Pages.json');
  }, []);

  const handleSearch = async (query, isExactSearch) => {
    const searchResults = await searchFromJSON(query, isExactSearch);
    setResults(searchResults);
  };

  return (
    <div>
      <div className='header'>
        <h1>Advanced Search</h1>
        <p>Search tool created for the Commercial Guide Digital Library</p>
      </div>
      
      <SearchBar onSearch={handleSearch} />
      <Results results={results} />
    </div>
  );
};

export default Search;
