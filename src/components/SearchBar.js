import React, { useState } from 'react';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');
    const [isExactSearch, setIsExactSearch] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query, isExactSearch);
  };

    const handleCheckboxChange = (event) => {
        setIsExactSearch(event.target.checked); // Update the state based on checkbox value
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
            <label>
                <input
                    type="checkbox"
                    checked={isExactSearch}
                    onChange={handleCheckboxChange}
                />
                Exact Search
            </label>
        <button type="submit">Search</button>
        </form>
    </div>
  );
};

export default SearchBar;
