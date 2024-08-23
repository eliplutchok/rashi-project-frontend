import React, {useContext} from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import authService from '../../utils/authService';

import './Profile.css';
import './Profile-Dark.css';

const Profile = () => {
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const username = authService.getCurrentUserName();

  return (
    <div className={`profile-home-container ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="profile-section">
        <h3>Hi, {username}.</h3>
        <p>This will be your profile page.</p>
      </div>
      <button className="profile-section-toggle dark-mode-toggle"
          onClick={toggleTheme}
          aria-label="Toggle Dark Mode"
        >
          {isDarkMode ? <i className="fas fa-sun"></i> : <i className="fas fa-moon"></i>}
      </button>
      <div className="profile-section-placeholder">
      </div>
    </div>
  );
};

export default Profile;