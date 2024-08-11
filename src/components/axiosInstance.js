import axios from 'axios';
import authService from './authService';

const axiosInstance = axios.create();

axiosInstance.interceptors.request.use(
  async (config) => {
    const accessToken = await authService.getCurrentToken();
    if (accessToken) {
        config.headers['Authorization'] = `Bearer ${accessToken}`;
      } 
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;