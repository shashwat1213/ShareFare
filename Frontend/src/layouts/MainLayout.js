import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Layout.css';

const Layout = ({ children, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <div className="layout">
      <nav className="navbar">
        <div className="navbar-container">
          <Link to="/dashboard" className="navbar-logo">
            <h1>💰 ShareFare</h1>
          </Link>
          <ul className="navbar-menu">
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/expenses">Expenses</Link></li>
            <li><Link to="/groups">Groups</Link></li>
            <li><Link to="/settle-up">Settle Up</Link></li>
            <li><Link to="/profile">Profile</Link></li>
            <li><button className="logout-btn" onClick={handleLogout}>Logout</button></li>
          </ul>
        </div>
      </nav>
      <main className="layout-main">
        {children}
      </main>
      <footer className="layout-footer">
        <p>&copy; 2026 ShareFare. Split expenses, split bills, split costs.</p>
      </footer>
    </div>
  );
};

export default Layout;
