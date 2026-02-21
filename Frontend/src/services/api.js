import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add JWT token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(`[API] ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('[API] Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    console.log(`[API] Response:`, response.data);
    return response;
  },
  (error) => {
    // Handle 401 - token expired or invalid
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('currentUser');
      window.location.href = '/login';
    }
    console.error('[API] Response error:', error);
    return Promise.reject(error);
  }
);

// Auth endpoints
export const signup = (name, email, password) => {
  return apiClient.post('/auth/signup', { name, email, password });
};

export const login = (email, password) => {
  return apiClient.post('/auth/login', { email, password });
};

export const verifyToken = () => {
  return apiClient.post('/auth/verify');
};

export const logout = () => {
  return apiClient.post('/auth/logout');
};

// Health endpoint
export const getHealth = () => {
  return apiClient.get('/health');
};

// Database test endpoint
export const testDatabase = () => {
  return apiClient.get('/db-test');
};

export default apiClient;
