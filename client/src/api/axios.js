import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  // Remove withCredentials — not needed since we use JWT in headers not cookies
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('devhire_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('devhire_token');
      localStorage.removeItem('devhire_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;