import './Navbar.css';
import React, { useState, useEffect, useMemo, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import authService from '../../utils/authService';
import navbarLinks from './navbarLinks';
import { ThemeContext } from '../../context/ThemeContext';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { isDarkMode, toggleTheme } = useContext(ThemeContext);

  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!authService.getCurrentUserName());
  const [selectedVersion, setSelectedVersion] = useState('published');
  const [selectedVersion1, setSelectedVersion1] = useState('published');
  const [selectedVersion2, setSelectedVersion2] = useState('gpt-4o-naive');

  const isAdmin = authService.getPrivilegeLevel() === 'admin';

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    setSelectedVersion(searchParams.get('version') || 'published');
    setSelectedVersion1(searchParams.get('version1') || 'published');
    setSelectedVersion2(searchParams.get('version2') || 'gpt-4o-naive');
  }, [location.search]);

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    authService.logout();
    setIsLoggedIn(false);
    navigate('/login');
  };

  const handleVersionChange = (event, setVersion, queryParam) => {
    const newVersion = event.target.value;
    setVersion(newVersion);

    const searchParams = new URLSearchParams(location.search);
    searchParams.set(queryParam, newVersion);
    navigate(`${location.pathname}?${searchParams.toString()}`, { replace: true });
    window.location.reload();
  };

  const getPageName = useMemo(() => {
    const path = location.pathname;
    const pageNameMapping = {
      '/profile': 'Profile',
      '/library': 'Library',
      '/admin': 'Admin',
      '/login': '',
      '/all-edits': 'All Edits',
      '/all-ratings': 'All Ratings',
      '/all-comparisons': 'All Comparisons',
    };

    if (path.startsWith('/page') || path.startsWith('/comparisonPage')) {
      const [,, book, page] = path.split('/');
      return `${book} ${page}`;
    }

    return pageNameMapping[path] || '';
  }, [location.pathname]);

  const renderVersionSelectors = () => {
    if (location.pathname.startsWith('/comparisonPage')) {
      return (
        <div className="navbar-compare-selectors">
          <VersionSelect
            value={selectedVersion1}
            onChange={(e) => handleVersionChange(e, setSelectedVersion1, 'version1')}
            className="version-select version-select-1"
          />
          <VersionSelect
            value={selectedVersion2}
            onChange={(e) => handleVersionChange(e, setSelectedVersion2, 'version2')}
            className="version-select version-select-2"
          />
        </div>
      );
    } else if (location.pathname.startsWith('/page')) {
      return (
        <VersionSelect
          value={selectedVersion}
          onChange={(e) => handleVersionChange(e, setSelectedVersion, 'version')}
          className="version-select"
        />
      );
    }
    return null;
  };

  const renderLinks = () => {
    return Object.entries(navbarLinks).map(([key, config]) => {
      const path = config.pathTemplate
        ? `${config.pathTemplate}${getPageName.replace(' ', '/')}`
        : config.path;

      if (config.requiresAdmin && !isAdmin) return null;
      if (config.requiresLoggedIn && !isLoggedIn) return null;
      if (config.requiresLoggedOut && isLoggedIn) return null;
      if (config.requiresPath && !location.pathname.startsWith(config.requiresPath)) return null;

      if (config.dropdown && config.dropdown.length > 0) {
        return (
          <div key={key} className="navbar-item">
            <a href={path}>{config.label}</a>
            <div className="dropdown">
              {config.dropdown.map((item) => (
                <a key={item.path} href={item.path}>{item.label}</a>
              ))}
            </div>
          </div>
        );
      }

      if (config.action === 'logout') {
        return <button key={key} onClick={handleLogout}>{config.label}</button>;
      }

      return <Link key={key} to={path} className={config.className}>{config.label}</Link>;
    });
  };

  return (
    <nav className={`navbar ${isDarkMode ? 'dark-mode' : ''}`}>
      <button 
          className="dark-mode-button"
          onClick={toggleTheme}
          aria-label="Toggle Dark Mode"
        >
          {isDarkMode ? <i className="fas fa-sun"></i> : <i className="fas fa-moon"></i>}
        </button>
      <div className="navbar-container">
        <div className="navbar-logo">
          <Link to="/home">
            <b className="rashi-logo-text">r<span className="ai-logo-text">a</span>sh<span className="ai-logo-text">i</span></b>
          </Link>
          
        </div>
        {renderVersionSelectors()}
        <div className="navbar-page-name">{getPageName}</div>
        <div className={`navbar-links ${isOpen ? 'open' : ''}`}>
          {renderLinks()}
        </div>
        <div className="navbar-toggle" onClick={toggleMenu}>
          <span>&#9776;</span>
        </div>
      </div>
    </nav>
  );
};

const VersionSelect = ({ value, onChange, className }) => (
  <select value={value} onChange={onChange} className={className}>
    <option value="published">Published</option>
    <option value="Sefaria-William-Davidson">William-Davidson</option>
    <option value="claude-opus-naive">claude-o-naive</option>
    <option value="gpt-4o-naive">gpt-4o-naive</option>
    <option value="mistral-v1">mistral-v1</option>
    <option value="gpt-4o-one-page-per-call">gpt-4o-v1</option>
  </select>
);

export default Navbar;