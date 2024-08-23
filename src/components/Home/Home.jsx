import React, { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../../utils/authService';
import { fetchReadingProgress } from '../../utils/readingProgress';
import { ThemeContext } from '../../context/ThemeContext'; 
import './Home.css';
import './Home-Dark.css';

const Home = () => {
  const username = authService.getCurrentUserName();
  const isAdmin = authService.isAdmin();
  const [lastProgress, setLastProgress] = useState(null);
  const navigate = useNavigate();

  const { isDarkMode, toggleTheme } = useContext(ThemeContext);

  useEffect(() => {
    const fetchLastReadingProgress = async () => {
      try {
        const userId = authService.getUserId();
        const progress = await fetchReadingProgress(userId);
        setLastProgress(progress);
      } catch (error) {
        console.error('Error fetching last reading progress:', error);
      }
    };

    fetchLastReadingProgress();
  }, []);

  const handleContinueReading = () => {
    if (lastProgress) {
      const { book_name, page_number, last_read_passage } = lastProgress;
      navigate(`/page/${book_name}/${page_number}?passageId=${last_read_passage}`);
    }
  };

  return (
    <div className={`home-container ${isDarkMode ? "dark-mode" : ""}`}>
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
        <div className="home-card continue-reading-card link-card" onClick={handleContinueReading}>
          <div className="card-content">
            <h4>Continue Reading</h4>
            <p>
              {lastProgress
                ? `${lastProgress.book_name} ${lastProgress.page_number}`
                : 'Continue where you left off'}
            </p>
          </div>
        </div>
        <Link to="/profile" className="home-card profile-card link-card">
          <div className="card-content">
            <h4>Profile</h4>
            <p>View and edit your profile.</p>
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
            {/* <Link to="/admin-info" className="home-card admin-info-card link-card">
              <div className="card-content">
                <h4>Admin Info</h4>
                <p>View admin information and resources.</p>
              </div>
            </Link> */}
          </>
        )}
        
        <Link to="/how-to-use" className="home-card how-to-card link-card">
              <div className="card-content">
                <h4>How to Use this Website</h4>
                <p>A short guide.</p>
              </div>
         </Link>
         <Link to="/" className="home-card toggle-card link-card" onClick={toggleTheme} aria-label="Toggle Dark Mode">
          <div className="card-content"
            >
            <h4>{isDarkMode ? <i className="fas fa-sun"></i> : <i className="fas fa-moon"></i>}</h4>
            <p>Toggle between light and dark mode.</p>
          </div>
        </Link>
    
      </div>
    </div>
  );
};

export default Home;