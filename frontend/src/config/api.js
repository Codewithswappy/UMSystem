// Centralized API configuration
// Using environment variable with fallback to localhost for development
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// For direct file/resource URLs (without /api prefix)
export const getServerUrl = () => {
  const url = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  // Remove '/api' to get base server URL
  return url.replace(/\/api$/, '');
};

export default API_BASE_URL;
