// API configuration
export const API_URL = import.meta.env.DEV 
  ? 'http://localhost:3000/api'  // Development
  : '/api';  // Production (relative path for same-origin requests) 