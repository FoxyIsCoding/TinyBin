// API configuration
const API_PORT = import.meta.env.VITE_API_PORT || '3001';
export const API_URL = `${window.location.protocol}//${window.location.hostname}:${API_PORT}/api`;