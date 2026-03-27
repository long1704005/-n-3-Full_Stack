import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || '';

const axiosClient = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});

axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (err) => Promise.reject(err)
);

axiosClient.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      if (!window.location.pathname.startsWith('/dang-nhap')) {
        window.dispatchEvent(new Event('auth:logout'));
      }
    }
    return Promise.reject(err);
  }
);

export default axiosClient;
