import '../css/Login.css';
import React, { useState } from 'react';
import PropTypes from 'prop-types';

const Login = ({ onSubmit }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [animationClass, setAnimationClass] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Both fields are required.');
      setAnimationClass('shake');
      setTimeout(() => setAnimationClass(''), 500); // Reset animation class
      return;
    }
    setError('');
    setIsSubmitting(true);
    try {
      await onSubmit({ username, password });
      setAnimationClass('lighting-up');
      setTimeout(() => setAnimationClass(''), 500); // Reset animation class
    } catch (err) {
      setError(err.message);
      setAnimationClass('shake');
      setIsSubmitting(false);
      setTimeout(() => setAnimationClass(''), 500); // Reset animation class
    }
  };

  return (
    <div className="login-wrapper">
      <div className={`login-container ${animationClass}`}>
        <h2>Login</h2>
        <div className="error-container">
          {error && <p className="error-message">{error}</p>}
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
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
              id="password}"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="login-button" disabled={isSubmitting}>
            {isSubmitting ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

Login.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

export default Login;