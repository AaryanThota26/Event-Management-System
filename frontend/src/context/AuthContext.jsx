import { createContext, useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import api from '../services/api'

// eslint-disable-next-line react/only-export-components
export const AuthContext = createContext(null)

const STORAGE_KEYS = {
  token: 'eventpro_token',
  user: 'eventpro_user',
}

const isProtectedPath = (pathname) =>
  pathname.startsWith('/events') ||
  pathname.startsWith('/user/') ||
  pathname.startsWith('/organizer/') ||
  pathname.startsWith('/admin/')

export function AuthProvider({ children }) {
  const { pathname } = useLocation()
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

  // True only during an intentional logout, while the (deferred) router
  // navigation away from the protected page is still committing. Prevents
  // ProtectedRoute from redirecting to /login in that window.
  const [loggingOut, setLoggingOut] = useState(false)

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

  // Once the deferred logout navigation commits to a public route, clear the
  // in-progress flag so the app guards normally again.
  useEffect(() => {
    if (loggingOut && !isProtectedPath(pathname)) {
      setLoggingOut(false)
    }
  }, [pathname, loggingOut])

  const login = async (email, password) => {
    setLoading(true)
    setLoggingOut(false)
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
    setLoggingOut(true)
    localStorage.removeItem(STORAGE_KEYS.token)
    localStorage.removeItem(STORAGE_KEYS.user)
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, loggingOut, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
