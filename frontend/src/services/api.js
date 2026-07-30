/**
 * API Service
 * -----------
 * Axios instance configured for backend communication.
 */

import axios from 'axios'
import apiConfig from '../utils/apiConfig'

const api = axios.create(apiConfig)

// Request interceptor — attach JWT token from localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('eventpro_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor — handle 401 by clearing auth and redirecting
// Skip redirect for auth endpoints (login/register) so the login page can show inline errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const isAuthRequest = error.config?.url?.includes('/api/auth/')
      if (!isAuthRequest) {
        localStorage.removeItem('eventpro_token')
        localStorage.removeItem('eventpro_user')
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default api
