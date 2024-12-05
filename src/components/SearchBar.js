import React, { useState } from 'react';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <div className='search-bar-container'>
        <form onSubmit={handleSubmit}>
        <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search..."
        />
        <button type="submit">Search</button>
        </form>
    </div>
  );
};

export default SearchBar;
