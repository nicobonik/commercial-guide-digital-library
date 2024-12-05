import React from 'react';
import { Link } from 'react-router-dom';

const NavBar = () => {
  return (
    <header className="navbar">
      <div className="navbar-title">Commercial Guide Digital Library</div>
      <nav className="navbar-links">
        <Link to="/">Library</Link>
        <Link to="/search">Search</Link>
        <Link to="/about">About</Link>
      </nav>
    </header>
  );
};

export default NavBar;
