import axios from "axios";

// ============================================
// API CLIENT
// Centralized place for all API calls
// Handles auth tokens, errors, responses
// ============================================

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ============================================
// REQUEST INTERCEPTOR
// Add JWT token to all requests
// ============================================

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ============================================
// RESPONSE INTERCEPTOR
// Handle common errors (401, 500, etc.)
// ============================================

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 - token expired or invalid
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // Redirect to login or show auth error
      window.location.href = "/login";
    }

    // Return error for component to handle
    return Promise.reject(error);
  },
);

export default api;
