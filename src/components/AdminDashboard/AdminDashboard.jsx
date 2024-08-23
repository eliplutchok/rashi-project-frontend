import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ThemeContext } from '../../context/ThemeContext';

import './AdminDashboard.css';
import './AdminDashboard-Dark.css';

const AdminDashboard = () => {
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);

  return (
    <div className={`admin-dashboard ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="statistics-card">
        <h2>Administrator Dashboard</h2>
        <p>With great power comes great responsibility.</p>
      </div>
      <div className="dashboard-link">
        <Link to="/all-edits">
          <div className="link-preview">
            <h2>All Edits</h2>
            <p>View and manage all edits</p>
          </div>
        </Link>
      </div>
      <div className="dashboard-link">
        <Link to="/all-ratings">
          <div className="link-preview">
            <h2>All Ratings</h2>
            <p>View and manage all ratings</p>
          </div>
        </Link>
      </div>
      <div className="dashboard-link">
        <Link to="/all-comparisons">
          <div className="link-preview">
            <h2>All Comparisons</h2>
            <p>View and manage all comparisons</p>
          </div>
        </Link>
      </div>
      <div className="dashboard-link">
        <Link to="/admin-info">
          <div className="link-preview">
            <h2>Admin Info</h2>
            <p>View all admin info</p>
          </div>
        </Link>
      </div>
      <button className="placeholder-card dark-mode-toggle"
          onClick={toggleTheme}
          aria-label="Toggle Dark Mode"
        >
          {isDarkMode ? <i className="fas fa-sun"></i> : <i className="fas fa-moon"></i>}
        
      </button>
      <div className="placeholder-card"></div>
      <div className="large-placeholder-card"></div>
    </div>
  );
};

export default AdminDashboard;