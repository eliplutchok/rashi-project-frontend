// authService.js
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';

const AUTH_URL = process.env.REACT_APP_AUTH_URL;

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
  const response = await apiClient.post('/users/signup', {
    name: credentials.email,
    password: credentials.password,
  });
  const { accessToken, refreshToken } = response.data;
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
  localStorage.setItem('username', credentials.email);
  return response.data;
};

const login = async (credentials) => {
  try {
    const response = await apiClient.post('/users/login', {
      username: credentials.username,
      password: credentials.password,
    });
    const { accessToken, refreshToken, privilege_level } = response.data;
    console.log('user', privilege_level);
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('username', credentials.username);
    localStorage.setItem('privilegeLevel', privilege_level);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 403) {
      throw new Error('Access denied. Please check your credentials.');
    }
    throw error;
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

const getPrivilegeLevel = () => {
  return localStorage.getItem('privilegeLevel');
};

const getCurrentToken = async () => {
  let accessToken = localStorage.getItem('accessToken');
  if (!accessToken) return null;
  const decodedToken = jwtDecode(accessToken);
  if (decodedToken.exp < Date.now() / 1000) {
    accessToken = await refreshAccessToken();
  }
  return accessToken;
};

const refreshAccessToken = async (refreshToken) => {
  const response = await apiClient.post('/token', { token: refreshToken });
  const { accessToken } = response.data;
  localStorage.setItem('accessToken', accessToken);
  return accessToken;
};

const authService = {
  login,
  logout,
  getCurrentUserName,
  getCurrentToken,
  register,
  refreshAccessToken,
  getPrivilegeLevel,
};

export default authService;