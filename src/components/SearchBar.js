import React, { useState } from 'react';

const SearchBar = ({ onSearch, onSearchAddress }) => {
  const [query, setQuery] = useState('');
  const [addressQuery, setAddressQuery] = useState('');
    const [isExactSearch, setIsExactSearch] = useState(false);
    const [isAddressSearch, setIsAddressSearch] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if(isAddressSearch) {
      onSearchAddress(query, addressQuery, isExactSearch);
    } else {
      onSearch(query, isExactSearch);
    }
  };

  const handleCheckboxChange = (event) => {
      setIsExactSearch(event.target.checked); // Update the state based on checkbox value
  };

  const handleAddressSearchToggle = (event) => {
      setIsAddressSearch(event.target.checked); // Update the state based on checkbox value
  };

    return (
    <div className='search-bar-container'>
        <form onSubmit={handleSubmit}>
        {isAddressSearch ? 
        <div>
          <input 
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Church, Street, Sestiere..."
            />
            
          <input 
            type="text"
            value={addressQuery}
            onChange={(e) => setAddressQuery(e.target.value)}
            placeholder="Address Number..."
            />
        </div>
        :
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search..."
        />
        }
        
        <button type="submit">Search</button>
        <label>
                <input className="search-bar-btn"
                    type="checkbox"
                    checked={isExactSearch}
                    onChange={handleCheckboxChange}
                />
                Exact Match Search
        </label>
        <label>
                <input className="search-bar-btn"
                    type="checkbox"
                    checked={isAddressSearch}
                    onChange={handleAddressSearchToggle}
                    defaultChecked="false"
                />
                Address Searcher
        </label>
        </form>
    </div>
  );
};

export default SearchBar;
