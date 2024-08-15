import React from 'react';
import authService from '../utils/authService';
import '../css/Profile.css'; // Make sure this path matches your project structure

const Profile = () => {
  const username = authService.getCurrentUserName();

  return (
    <div className="profile-home-container">
      <h3>Hi, {username}.</h3>
      <p>This will be your profile page.</p>
    </div>
  );
};

export default Profile;