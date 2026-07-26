import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { useAuth } from './hooks/useAuth'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import './App.css'

function ProtectedRoute({ children }) {
  const { token } = useAuth()
  if (!token) return <Navigate to="/login" replace />
  return children
}

function PublicRoute({ children }) {
  const { token, user } = useAuth()
  if (token && user) {
    const route = ROLE_REDIRECT[user.role] || '/user/dashboard'
    return <Navigate to={route} replace />
  }
  return children
}

const ROLE_REDIRECT = {
  admin: '/admin/dashboard',
  organizer: '/organizer/dashboard',
  user: '/user/dashboard',
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/organizer/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  )
}

function HomePage() {
  return (
    <div className="home-page">
      <h2>Home</h2>
      <p>This is the home page of the Event Management System.</p>
    </div>
  )
}

export default App
