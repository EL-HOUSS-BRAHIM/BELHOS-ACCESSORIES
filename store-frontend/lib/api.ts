import axios, { type AxiosInstance } from 'axios';

// Use environment variable for API URL, with fallback for development
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getJson = async (url: string) => {
  console.debug('[API] GET request dispatched via getJson', { url });
  const response = await api.get(url);
  console.debug('[API] GET response received via getJson', {
    url,
    status: response.status,
  });
  return response.data as unknown;
};

// Add token to requests
api.interceptors.request.use((config) => {
  console.debug('[API] Request', {
    method: config.method,
    url: `${config.baseURL ?? ''}${config.url ?? ''}`,
  });
  // Check if we're in browser environment
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.debug('[API] Response', {
      method: response.config?.method,
      url: `${response.config?.baseURL ?? ''}${response.config?.url ?? ''}`,
      status: response.status,
    });
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Redirect to login page
        window.location.href = '/login';
      }
    }
    console.error('[API] Response error', {
      method: error.config?.method,
      url: `${error.config?.baseURL ?? ''}${error.config?.url ?? ''}`,
      status: error.response?.status,
    });
    return Promise.reject(error);
  }
);

export default api;
