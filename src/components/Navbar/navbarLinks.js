// src/components/navbarLinks.js

const navbarLinks = {
  compare: {
    label: 'Compare',
    pathTemplate: '/comparisonPage/', // Use a template for dynamic paths
    requiresPath: '/page',
    requiresLoggedIn: true,
    className: 'navbar-compare-button special-link',
  },
  standard: {
    label: 'Standard',
    pathTemplate: '/page/',
    requiresPath: '/comparisonPage',
    requiresLoggedIn: true,
    className: 'navbar-compare-button special-link',
  },
  profile: {
    label: 'Profile',
    path: '/profile',
    requiresLoggedIn: true,
    dropdown: [
      
    ],
  },
  library: {
    label: 'Library',
    path: '/library',
    requiresLoggedIn: true,
    dropdown: [
      { label: 'Mishnah', path: '/library/Mishnah' },
      { label: 'Talmud', path: '/library/Talmud' },
      { label: 'Tanach', path: '/library/Tanach' },
      { label: 'Mussar', path: '/library/Mussar' },
      { label: 'Halacha', path: '/library/Halacha' },
      { label: 'Kabbalah', path: '/library/Kabbalah' },
      { label: 'Other', path: '/library/Other' },
      {label: 'Queries (beta)', path: '/query-talmud'},
    ],
  },
  admin: {
    label: 'Admin',
    path: '/admin',
    requiresAdmin: true,
    requiresLoggedIn: true,
    dropdown: [
      { label: 'Edits', path: '/all-edits' },
      { label: 'Ratings', path: '/all-ratings' },
      { label: 'Comparisons', path: '/all-comparisons' },
      { label: 'Admin Info', path: '/admin-info' },
    ],
  },
  login: {
    label: 'Login',
    path: '/login',
    requiresLoggedOut: true,
  },
  logout: {
    label: 'Logout',
    action: 'logout',
    requiresLoggedIn: true,
  },
};

export default navbarLinks;