import React from 'react';
import { Navigate } from 'react-router-dom';
import authService from './utils/authService';

const PrivateRoute = ({ children }) => {
  const currentToken = authService.getCurrentToken();
  if (!currentToken) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default PrivateRoute;