import React from 'react';
import '../styles/Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <h1>SHAREFAR.AI</h1>
        </div>
        <ul className="navbar-menu">
          <li><a href="/">Home</a></li>
          <li><a href="/dashboard">Dashboard</a></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
