import React from 'react';
import authService from './authService';
import '../css/Home.css'; // Make sure this path matches your project structure

const Home = () => {
  const username = authService.getCurrentUserName();

  return (
    <div className="home-container">
      <h3>Welcome, {username}.</h3>
      <ul>
        <li>This is your home page.</li>
        <li>The site is currently under development.</li>
        <li>Some pages and functionalities are not fully built out yet.</li>
        <li>Use the navbar to navigate to existing pages.</li>
        <li>Admins have access to additional features and pages.</li>
        <li>There may be some bugs. If the site is not responding, try refreshing the page.</li>
        <li>Thank you for visiting!</li>
      </ul>
    </div>
  );
};

export default Home;