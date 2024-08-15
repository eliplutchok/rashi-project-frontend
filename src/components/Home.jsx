import React from 'react';
import authService from '../utils/authService';
import { Link } from 'react-router-dom';
import '../css/Home.css';

const Home = () => {
  const username = authService.getCurrentUserName();
  const isAdmin = authService.isAdmin(); // Assume this function checks if the user is an admin

  return (
    <div className="home-container">
      <div className="grid-container">
        <div className="home-card welcome-card">
          <div className="card-content">
            <h3>Welcome, {username}.</h3>
            <ul>
              <li>This is your home page.</li>
              <li>The site is currently under development.</li>
              <li>Some pages and functionalities are not fully built out yet.</li>
              <li>Admins have access to additional features and pages.</li>
              <li>There may be some bugs. If the site is not responding, try refreshing the page.</li>
              <li>Thank you for visiting!</li>
            </ul>
          </div>
        </div>
        <Link to="/about" className="home-card about-card link-card">
          <div className="card-content">
            <h4>About</h4>
            <p>Learn more about us.</p>
          </div>
        </Link>
        <Link to="/library" className="home-card library-card link-card">
          <div className="card-content">
            <h4>Library</h4>
            <p>Browse all available books.</p>
          </div>
        </Link>
        <Link to="/profile" className="home-card profile-card link-card">
          <div className="card-content">
            <h4>Profile</h4>
            <p>View and edit your profile.</p>
          </div>
        </Link>
        <Link to="/continue-reading" className="home-card continue-reading-card link-card">
          <div className="card-content">
            <h4>Continue Reading</h4>
            <p>Continue where you left off.</p>
          </div>
        </Link>
        {isAdmin && (
          <>
            <Link to="/admin" className="home-card admin-dashboard-card link-card">
              <div className="card-content">
                <h4>Admin Dashboard</h4>
                <p>Access admin features and settings.</p>
              </div>
            </Link>
            <Link to="/admin-info" className="home-card admin-info-card link-card">
              <div className="card-content">
                <h4>Admin Info</h4>
                <p>View admin information and resources.</p>
              </div>
            </Link>
          </>
        )}
        <div className="home-card blank-card">
          <div className="card-content">
            <h4>Placeholder</h4>
            <p>More cards will be added here.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;