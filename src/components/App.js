import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './NavBar';
import Home from './Home';
import Search from './SearchPage';
import About from './About';
import buildDatabaseFromFolder from '../db/buildDatabase';
import exportIndexedDBToJSON from '../db/exportDB'
import { DB_NAME, STORE_NAME } from '../db/indexedDB';

const App = () => {

  // useEffect(() => {
  //   const buildDatabase = () => {
  //     exportIndexedDBToJSON(DB_NAME, STORE_NAME);
  //   };
  //   buildDatabase();
  // }, 
  // []);

  return (
    <Router>
      <div>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
