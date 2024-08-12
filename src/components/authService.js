// authService.js
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import { io } from 'socket.io-client';

const AUTH_URL = process.env.REACT_APP_AUTH_URL;
const SOCKET_URL = process.env.REACT_APP_API_SOCKET_URL


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

// let socket;

// const connectWebSocket = (token) => {
//   socket = io(SOCKET_URL, {
//     transports: ['websocket'],
//     auth: {
//       token: `Bearer ${token}`
//     }
//   });

//   socket.on('connect', () => {
//     console.log('Connected to WebSocket server');
//   });

//   socket.on('disconnect', () => {
//     console.log('Disconnected from WebSocket server');
//   });

//   socket.on('message', (data) => {
//     console.log('Received message:', data);
//   });
// };

const register = async (credentials) => {
  const response = await apiClient.post('/users/signup', {
    name: credentials.email,
    password: credentials.password,
  });
  const { accessToken, refreshToken } = response.data;
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
  localStorage.setItem('username', credentials.email);
  // connectWebSocket(accessToken);
  return response.data;
};

const login = async (credentials) => {
  // try clearing the local storage
  try {
    localStorage.clear();
  } catch (error) {
    console.error('Error clearing local storage:', error);
  }
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
    // connectWebSocket(accessToken);
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

// const getCurrentToken = async () => {
//   let accessToken = localStorage.getItem('accessToken');
//   if (!accessToken) return null;
//   const decodedToken = jwtDecode(accessToken);
//   if (decodedToken.exp < Date.now() / 1000) {
//     accessToken = await refreshAccessToken();
//   }
//   return accessToken;
// };

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
  // connectWebSocket(accessToken);
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