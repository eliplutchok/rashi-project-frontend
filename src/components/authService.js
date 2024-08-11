// authService.js

import axios from 'axios';
import {jwtDecode} from 'jwt-decode';

const AUTH_URL = process.env.REACT_APP_AUTH_URL;

const register = async (credentials) => {
  const response = await axios.post(`${AUTH_URL}/users/signup`, {
    name: credentials.email,
    password: credentials.password,
  });
  const { accessToken, refreshToken } = response.data;
  localStorage.setItem('accessToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);
  localStorage.setItem('username', credentials.email);
  return response.data;
}

const login = async (credentials) => {
  try {
    const response = await axios.post(`${AUTH_URL}/users/login`, {
      username: credentials.username,
      password: credentials.password,
    });
    const { accessToken, refreshToken, privilege_level} = response.data;
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

    await axios.delete(`${AUTH_URL}/logout`, {
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
}

const getCurrentToken = async () => {
  // if the token is expired, refresh it
  let accessToken = localStorage.getItem('accessToken');
  if (!accessToken) return null;
  const decodedToken = jwtDecode(accessToken);
  if (decodedToken.exp < Date.now() / 1000) {
    accessToken = await refreshAccessToken();
  }
  return accessToken;
}

const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) throw new Error('No refresh token available');
  const response = await axios.post(`${AUTH_URL}/token`, { token: refreshToken });
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