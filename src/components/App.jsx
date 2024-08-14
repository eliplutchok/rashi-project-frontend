import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import Home from './Home';
import Navbar from './Navbar';
import Profile from './Profile';
import Library from './Library';
import Page from './Page';
import ComparisonPage from './ComparisonPage';
import Admin from './AdminDashboard';
import AllEdits from './AllEdits';
import AllRatings from './AllRatings';
import authService from '../utils/authService';
import PrivateRoute from './PrivateRoute';

const App = () => {
  const handleLogin = async (credentials) => {
    try {
      const data = await authService.login(credentials);
      console.log('Login successful:', data);
      window.location.href = '/home';
    } catch (error) {
      handleAuthError(error);
    }
  };

  const handleRegister = async (credentials) => {
    try {
      const data = await authService.register(credentials);
      console.log('Registration successful:', data);
      window.location.href = '/home';
    } catch (error) {
      handleAuthError(error);
    }
  };

  const handleAuthError = (error) => {
    if (error.response) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error(error.message);
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
          path="/comparisonPage/:book/:page"
          element={
            <PrivateRoute>
              <ComparisonPage />
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

export default App;