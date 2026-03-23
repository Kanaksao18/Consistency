import axios from 'axios';
import toast from 'react-hot-toast';
import useAuthStore from '../store/useAuthStore';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Interceptor to add token to requests
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.error || error.response?.data?.details || 'An unexpected error occurred';
    
    // Only show toast if it's not a 401 (Auth handles that)
    if (error.response?.status !== 401) {
       toast.error(message);
    }
    
    return Promise.reject(error);
  }
);

export default api;
