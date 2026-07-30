import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { useAuth } from './hooks/useAuth'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import OrganizerDashboard from './pages/OrganizerDashboard'
import AdminDashboard from './pages/AdminDashboard'
import Events from './pages/Events'
import EventDetail from './pages/EventDetail'
import MyRegistrations from './pages/MyRegistrations'
import './App.css'

function ProtectedRoute({ children, allowedRoles }) {
  const { token, user } = useAuth()
  if (!token) return <Navigate to="/login" replace />
  // If the route requires specific roles, enforce them
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // Redirect unauthorized users to their own dashboard
    const fallback = ROLE_REDIRECT[user?.role] || '/user/dashboard'
    return <Navigate to={fallback} replace />
  }
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
        {/* Skip-to-main link for keyboard users */}
        <a className="skip-to-main" href="#main-content">
          Skip to main content
        </a>
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
            path="/signup"
            element={
              <PublicRoute>
                <Signup />
              </PublicRoute>
            }
          />
          <Route
            path="/events"
            element={
              <ProtectedRoute>
                <Events />
              </ProtectedRoute>
            }
          />
          <Route
            path="/events/:id"
            element={
              <ProtectedRoute>
                <EventDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/registrations"
            element={
              <ProtectedRoute>
                <MyRegistrations />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/organizer/dashboard"
            element={
              <ProtectedRoute allowedRoles={['organizer']}>
                <OrganizerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/dashboard"
            element={
              <ProtectedRoute allowedRoles={['user']}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  )
}

function HomePage() {
  return (
    <div className="home-page min-h-screen flex flex-col items-center justify-center bg-surface-bright p-xl" id="main-content">
      <span className="material-symbols-outlined text-6xl text-primary mb-lg" aria-hidden="true">calendar_today</span>
      <h1 className="font-display-lg text-display-lg text-on-background mb-md text-center">EventPro</h1>
      <p className="text-body-lg text-on-surface-variant mb-xl text-center max-w-lg">
        Welcome to the Event Management System. Please sign in to continue.
      </p>
      <a
        href="/login"
        className="px-xl py-md bg-primary text-on-primary rounded-lg font-label-md hover:bg-primary-container transition-colors shadow-md"
      >
        Sign In
      </a>
    </div>
  )
}

export default App
