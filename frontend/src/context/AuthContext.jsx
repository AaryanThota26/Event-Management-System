import { createContext, useState, useEffect } from 'react'
import api from '../services/api'

// eslint-disable-next-line react/only-export-components
export const AuthContext = createContext(null)

const STORAGE_KEYS = {
  token: 'eventpro_token',
  user: 'eventpro_user',
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.user)
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })

  const [token, setToken] = useState(() =>
    localStorage.getItem(STORAGE_KEYS.token)
  )

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (token) {
      localStorage.setItem(STORAGE_KEYS.token, token)
    } else {
      localStorage.removeItem(STORAGE_KEYS.token)
    }
  }, [token])

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user))
    } else {
      localStorage.removeItem(STORAGE_KEYS.user)
    }
  }, [user])

  const login = async (email, password) => {
    setLoading(true)
    try {
      const response = await api.post('/api/auth/login', { email, password })
      const { access_token, user: userData } = response.data

      setToken(access_token)
      setUser(userData)

      return { success: true, user: userData }
    } catch (error) {
      if (error.response?.status === 401) {
        // Invalid credentials — use a fixed user-facing message, never expose backend detail
        return { success: false, message: 'Invalid email or password.' }
      }
      // Network / server errors
      return { success: false, message: 'Unable to connect to the server. Please try again.' }
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
