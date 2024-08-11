import  '../css/Login.css';

import React, { useState } from 'react';
import PropTypes from 'prop-types';



const Login = ({ onSubmit }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Both fields are required.');
      return;
    }
    setError('');
    onSubmit({ username, password });
  };

  return (
  <div className="login-wrapper">
    <div className="login-container">
      <h2>Login</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="username"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>

      {/* <div className="register-link">
        <p>Don't have an account? <a href="/register">Register</a></p>
      </div> */}
    </div>
  </div>
  );
};

Login.propTypes = {
  /**
   * Function to handle form submission.
   */
  onSubmit: PropTypes.func.isRequired,
};

export default Login;