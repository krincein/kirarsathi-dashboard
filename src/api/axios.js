import axios from 'axios';

// const BASE_URL = 'http://localhost:5002';
const BASE_URL = 'https://kirarsathibackend.onrender.com';

export const instance = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

instance.interceptors.request.use(
  async config => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  error => Promise.reject(error),
);

instance.interceptors.response.use(
  response => {
    const { status, data } = response;
    if (status >= 200 && status < 350) {
      return data;
    }
    return Promise.reject(data?.message || 'Unexpected response from server');
  },
  error => {
    if (error.response) {
      const { status, data } = error.response;
      if (status >= 400 && status < 550) {
        const message = data?.message || 'Something went wrong';
        return Promise.reject(message);
      }
      return Promise.reject(data);
    }
    return Promise.reject('Network error. Please check your connection.');
  },
);
