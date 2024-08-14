import React from 'react';
import { Link } from 'react-router-dom';
import '../css/AdminDashboard.css';

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <nav>
        <ul>
          <li><Link to="/all-edits">All Edits</Link></li>
          <li><Link to="/all-ratings">All Ratings</Link></li>
        </ul>
      </nav>
    </div>
  );
};

export default AdminDashboard;