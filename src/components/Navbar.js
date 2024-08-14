import '../css/Navbar.css';
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import authService from '../utils/authService';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!authService.getCurrentUserName());
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    authService.logout();
    setIsLoggedIn(false);
    navigate('/login');
  };

  const isAdmin = authService.getPrivilegeLevel() === 'admin';

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const pageNameMapping = {
    '/home': 'Home',
    '/profile': 'Profile',
    '/library': 'Library',
    '/admin': 'Admin',
    '/login': ' ',
    '/all-edits': 'All Edits',
    '/all-ratings': 'All Ratings',
    // Add more static mappings here as needed
  };

  const getPageName = () => {
    const path = location.pathname;

    if (path.startsWith('/page')) {
      const parts = path.split('/');
      if (parts.length >= 4) {
        const book = parts[2];
        const page = parts[3];
        return `${book} ${page}`;
      }
    }

    return pageNameMapping[path] || 'Library';
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <Link to="/home"><b className='rashi-logo-text'>r<span className='ai-logo-text'>a</span>sh<span className='ai-logo-text'>i</span></b></Link>
        </div>
        <div className="navbar-page-name">
          {getPageName()}
        </div>
        <div className={`navbar-links ${isOpen ? 'open' : ''}`}>
          {isLoggedIn && <Link to="/profile">Profile</Link>}
          {isLoggedIn && <Link to="/library">Library</Link>}
          {isAdmin && isLoggedIn && <Link to="/admin">Admin</Link>}
          {!isLoggedIn && <Link to="/login">Login</Link>}
          {isLoggedIn && <button onClick={handleLogout}>Logout</button>}
        </div>
        <div className="navbar-toggle" onClick={toggleMenu}>
          <span>&#9776;</span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;