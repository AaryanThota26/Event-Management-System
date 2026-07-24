/**
 * API Configuration
 * -----------------
 * Central configuration for API endpoints.
 */

const API_BASE_URL = 'http://localhost:8000'

const apiConfig = {
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
}

export default apiConfig
