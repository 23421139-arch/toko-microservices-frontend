import axios from 'axios';

// Kita tidak set baseURL satu per satu di sini karena ada 3 service berbeda.
// Kita buat helper function untuk mendapatkan header token.

export const getAuthHeaders = () => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      return { Authorization: `Bearer ${token}` };
    }
  }
  return {};
};

// Interceptor opsional: Jika token expired (401/403), auto logout
export const handleSessionExpired = (error) => {
  if (error.response && (error.response.status === 401 || error.response.status === 403)) {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
  }
  return Promise.reject(error);
};