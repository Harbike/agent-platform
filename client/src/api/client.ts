import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:3000/api/v1', // Update if your Express server runs on a different port
  withCredentials: true, // Crucial if you are using HTTP-only cookies for session refresh tokens
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach access token if stored in memory/localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('amp_access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to catch unauthorized or expired sessions (WI-9 / FR-4)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // Check if it's an immediate deactivation flag or expired session
      const errorCode = error.response.data?.code;
      if (errorCode === 'ACCOUNT_DEACTIVATED' || errorCode === 'SESSION_EXPIRED') {
        localStorage.removeItem('amp_access_token');
        window.location.href = '/login?expired=true';
      }
    }
    return Promise.reject(error);
  }
);