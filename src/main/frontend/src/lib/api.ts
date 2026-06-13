import axios from 'axios';

/**
 * Shared Axios instance.
 * Automatically attaches the JWT Bearer token from localStorage to every request.
 */
const api = axios.create({
  baseURL: '/',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ecom_auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
