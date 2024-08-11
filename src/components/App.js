import  '../css/Login.css';

import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import Home from './Home';
import Navbar from './Navbar';
import Profile from './Profile';
import Posts from './Posts';
import Library from './Library';
import Page from './Page';
import Admin from './AdminDashboard';
import AllEdits from './AllEdits';
import AllRatings from './AllRatings';
import authService from './authService';

const App = () => {
  

  const handleLogin = async (credentials) => {
    try {
      const data = await authService.login(credentials);
      console.log('Login successful:', data);
       // Redirect to home page, dont use navigate here
       window.location.href = '/home';

    } catch (error) {
      if (error.response) {
        console.error('Login failed:', error.response.data);
      } else {
        console.error('Error:', error.message);
      }
    }
  };

  const handleRegister = async (credentials) => {
    try {
      const data = await authService.register(credentials);
      console.log('Registration successful:', data);
      window.location.href = '/home';
    } catch (error) {
      if (error.response) {
        console.error('Registration failed:', error.response.data);
      } else {
        console.error('Error:', error.message);
      }
    }
  };

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login onSubmit={handleLogin} />} />
        <Route path="/register" element={<Register onSubmit={handleRegister} />} />
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="/posts"
          element={
            <PrivateRoute>
              <Posts />
            </PrivateRoute>
          }
        />
        <Route
          path="/library/:section?/:book?/:page?"
          element={
            <PrivateRoute>
              <Library />
            </PrivateRoute>
          }
        />
        <Route
          path="/page/:book/:page"
          element={
            <PrivateRoute>
              <Page />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <Admin />
            </PrivateRoute>
          }
        />
        <Route
          path="/all-edits"
          element={
            <PrivateRoute>
              <AllEdits />
            </PrivateRoute>
          }
        />
        <Route
          path="/all-ratings"
          element={
            <PrivateRoute>
              <AllRatings />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/home" />} />
        
      </Routes>
    </Router>
  );
};

const PrivateRoute = ({ children }) => {
  const currentToken = authService.getCurrentToken();
  if (!currentToken) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default App;