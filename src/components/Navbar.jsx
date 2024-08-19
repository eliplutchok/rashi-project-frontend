import '../css/Navbar.css';
import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import authService from '../utils/authService';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!authService.getCurrentUserName());
  const [selectedVersion, setSelectedVersion] = useState('published');
  const [selectedVersion1, setSelectedVersion1] = useState('published');
  const [selectedVersion2, setSelectedVersion2] = useState('gpt-4o-naive');

  const isAdmin = authService.getPrivilegeLevel() === 'admin';

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

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <Link to="/home">
            <b className="rashi-logo-text">r<span className="ai-logo-text">a</span>sh<span className="ai-logo-text">i</span></b>
          </Link>
        </div>
        {renderVersionSelectors()}
        <div className="navbar-page-name">{getPageName}</div>
        <div className={`navbar-links ${isOpen ? 'open' : ''}`}>
          {location.pathname.startsWith('/page') && (
            <Link to={`/comparisonPage/${getPageName.replace(' ', '/')}`} className="navbar-compare-button">
              Compare
            </Link>
          )}
          {location.pathname.startsWith('/comparisonPage') && (
            <Link to={`/page/${getPageName.replace(' ', '/')}`} className="navbar-compare-button">
              Standard
            </Link>
          )}
          {isLoggedIn && <Link to="/profile">Profile</Link>}
          {isLoggedIn && <Link to="/library">Library</Link>}
          {isAdmin && isLoggedIn && <Link to="/admin">Admin</Link>}
          {!isLoggedIn && <Link to="/login">Login</Link>}
          {isLoggedIn && <button onClick={handleLogout}>Logout</button>}
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
    {/* Add more options as needed */}
  </select>
);

export default Navbar;