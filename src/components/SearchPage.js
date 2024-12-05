import React, { useEffect, useState } from 'react';
import SearchBar from './SearchBar';
import {loadJSONData, searchFromJSON} from '../utils/JSONSearch';
import Results from './Results';

const Search = () => {
  const [results, setResults] = useState([]);

  useEffect(() => {
    loadJSONData('/TextDB-Pages.json');
  }, []);

  const handleSearch = async (query) => {
    const searchResults = await searchFromJSON(query, 'exact');
    setResults(searchResults);
  };

  return (
    <div>
      <SearchBar onSearch={handleSearch} />
      <Results results={results} />
    </div>
  );
};

export default Search;
