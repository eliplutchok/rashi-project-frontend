import React from 'react';
import { Link } from 'react-router-dom';
import '../css/AdminDashboard.css';

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard">
      <div className="dashboard-links">
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
      </div>
    </div>
  );
};

export default AdminDashboard;