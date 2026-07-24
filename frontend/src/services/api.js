/**
 * API Service
 * -----------
 * Axios instance configured for backend communication.
 */

import axios from 'axios'
import apiConfig from '../utils/apiConfig'

const api = axios.create(apiConfig)

// Request interceptor - will add JWT token in later phases
api.interceptors.request.use(
  (config) => {
    // TODO: Add Authorization header with JWT token
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor - will handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // TODO: Handle 401 unauthorized, redirect to login
    return Promise.reject(error)
  }
)

export default api
