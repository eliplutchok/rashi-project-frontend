import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ThemeProvider } from '../../context/ThemeContext'; 
import Login from '../Login/Login';
import Register from '../Login/Register';
import Home from '../Home/Home';
import Navbar from '../Navbar/Navbar';
import Profile from '../Profile/Profile';
import Library from '../Library/Library';
import Page from '../Page/Page';
import ComparisonPage from '../ComparisonPage/ComparisonPage';
import Admin from '../AdminDashboard/AdminDashboard';
import AllEdits from '../AdminViews/AllEdits';
import AllRatings from '../AdminViews/AllRatings';
import AllComparisons from '../AdminViews/AllComparisons';
import About from '../About/About';
import HowToUse from '../HowToUse/HowToUse';
import AdminInfoPage from '../AdminInfo/AdminInfoPage';
import QueryTalmud from '../QueryTalmud/QueryTalmud';
import QueryTalmudDeep from '../QueryTalmud/QueryTalmudDeep';
import authService from '../../utils/authService';
import PrivateRoute from '../../PrivateRoute';
import '@fortawesome/fontawesome-free/css/all.min.css';

import './App.css';

const App = () => {

  const [isScrollingUp, setIsScrollingUp] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const SCROLL_Y_THRESHOLD = 50;

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > SCROLL_Y_THRESHOLD) {
        // Scrolling down
        setIsScrollingUp(false);
      } else {
        // Scrolling up
        setIsScrollingUp(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  const handleLogin = async (credentials) => {
    try {
      await authService.login(credentials);
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
    <ThemeProvider>
    <Router>
      <div className={`navbar-wrapper ${isScrollingUp ? 'visible' : 'hidden'}`}>
      <Navbar />
      </div>
      <div className="app-content">
        
      <Routes>
        <Route path="/about" element={<About />} />
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
          path="/query-talmud"
          element={
            <PrivateRoute>
              <QueryTalmud />
            </PrivateRoute>
          }
        />
        <Route
          path="/query-talmud-deep"
          element={
            <PrivateRoute>
              <QueryTalmudDeep />
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
          path="/admin-info"
          element={
            <PrivateRoute>
              <AdminInfoPage />
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
        <Route
          path="/all-comparisons"
          element={
            <PrivateRoute>
              <AllComparisons />
            </PrivateRoute>
          }
        />
        
        <Route path="/how-to-use" element={<HowToUse />} />
        <Route path="*" element={<Navigate to="/home" />} />
      </Routes>
      </div>
    </Router>
    </ThemeProvider>
  );
};

export default App;