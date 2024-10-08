import axios from 'axios';
import {jwtDecode} from 'jwt-decode';

const AUTH_URL = process.env.REACT_APP_AUTH_URL;

const axiosStandardInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Create an Axios instance with default settings
const apiClient = axios.create({
  baseURL: AUTH_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to include tokens in requests
apiClient.interceptors.request.use(async (config) => {
  const token = await getCurrentToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor to handle errors globally
apiClient.interceptors.response.use(response => response, async (error) => {
  if (error.response && error.response.status === 403) {
    console.error('Access denied. Please check your credentials.');
  } else if (error.response && error.response.status === 401) {
    // Handle token expiration and refresh logic here
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      try {
        const response = await refreshAccessToken(refreshToken);
        localStorage.setItem('accessToken', response.data.accessToken);
        error.config.headers['Authorization'] = 'Bearer ' + response.data.accessToken;
        return axios(error.config);
      } catch (refreshError) {
        logout();
      }
    }
  }
  return Promise.reject(error);
});

const register = async (credentials) => {
  const response = await apiClient.post('/signup', {
    name: credentials.email,
    password: credentials.password,
  });
  const { accessToken, refreshToken } = response.data;
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
  localStorage.setItem('username', credentials.email);
  localStorage.setItem('userId', response.data.id);
  // connectWebSocket(accessToken);
  return response.data;
};

// auth service file
const login = async (credentials) => {
  try {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('privilegeLevel');
    localStorage.removeItem('userId');
    const response = await apiClient.post('/login', {
      username: credentials.username,
      password: credentials.password,
    });
    const { accessToken, refreshToken, privilege_level } = response.data;
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('username', credentials.username);
    localStorage.setItem('privilegeLevel', privilege_level);
    localStorage.setItem('userId', response.data.user_id);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error('Network Error');
    }
  }
};

const logout = async () => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) throw new Error('No refresh token available');

    await apiClient.delete('/logout', {
      data: { token: refreshToken }
    });

    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('username');
    localStorage.removeItem('privilegeLevel');
  } catch (error) {
    console.error('Logout failed:', error);
  }
};

const getCurrentUserName = () => {
  return localStorage.getItem('username');
};

const getUserId = () => {
  return localStorage.getItem('userId');
};

const getPrivilegeLevel = () => {
  return localStorage.getItem('privilegeLevel');
};

const isAdmin = () => {
  return getPrivilegeLevel() === 'admin';
}

const getCurrentToken = async () => {
  let accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken'); // Get the refresh token

  if (!accessToken) return null;
  const decodedToken = jwtDecode(accessToken);

  if (decodedToken.exp < Date.now() / 1000) {
    if (!refreshToken) return null; // Ensure refresh token is available
    accessToken = await refreshAccessToken(refreshToken); // Pass the refresh token
  }

  return accessToken;
};

const refreshAccessToken = async (refreshToken) => {
  const response = await axiosStandardInstance.post('/token', { token: refreshToken });
  const { accessToken } = response.data;
  localStorage.setItem('accessToken', accessToken);
  return accessToken;
};

const authService = {
  login,
  logout,
  getCurrentUserName,
  getUserId,
  getCurrentToken,
  register,
  refreshAccessToken,
  getPrivilegeLevel,
  isAdmin
};

export default authService;