/**
 * API Configuration
 * -----------------
 * Central configuration for API endpoints.
 */

const API_BASE_URL = "https://event-management-api-aw25.onrender.com";

const apiConfig = {
  baseURL: API_BASE_URL,
  timeout: 6000,
  headers: {
    'Content-Type': 'application/json',
  },
}

export default apiConfig
