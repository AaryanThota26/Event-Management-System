/**
 * API Configuration
 * -----------------
 * Central configuration for API endpoints.
 *
 * The backend URL is resolved from the VITE_API_BASE_URL environment variable:
 *   - Development (`npm run dev`):  VITE_API_BASE_URL=http://localhost:8000
 *   - Production  (`npm run build`): VITE_API_BASE_URL=https://event-management-api-aw25.onrender.com
 *
 * When VITE_API_BASE_URL is unset, a safe environment-specific default is used
 * (dev → localhost, prod → Render) so local work never targets the live backend.
 */

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.DEV
    ? 'http://localhost:8000'
    : 'https://event-management-api-aw25.onrender.com')

const apiConfig = {
  baseURL: API_BASE_URL,
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
}

export default apiConfig
export { API_BASE_URL }
