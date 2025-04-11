import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance with base URL
const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true
});

// Add request interceptor to add auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle auth errors
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        // Clear auth data
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        
        // Redirect to login if not already there
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      }
      // Return the error response for handling by the component
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;