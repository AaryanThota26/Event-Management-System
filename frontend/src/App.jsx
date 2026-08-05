import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { useAuth } from './hooks/useAuth'
import AuthenticatedLayout from './components/AuthenticatedLayout'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import Dashboard from './pages/Dashboard'
import OrganizerDashboard from './pages/OrganizerDashboard'
import AdminDashboard from './pages/AdminDashboard'
import Events from './pages/Events'
import EventDetail from './pages/EventDetail'
import MyRegistrations from './pages/MyRegistrations'
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsOfService from './pages/TermsOfService'
import HelpCenter from './pages/HelpCenter'
import LandingPage from './components/landing/LandingPage'
import './App.css'

function ProtectedRoute({ children, allowedRoles }) {
  const { token, user, loggingOut } = useAuth()
  // Intentional logout is in flight (auth cleared, router still leaving the
  // protected page). Render nothing rather than redirect to /login so the
  // login page never flashes for even a single frame.
  if (loggingOut) return null
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

function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (!hash) window.scrollTo(0, 0)
  }, [pathname, hash])
  return null
}

function App() {
  return (
    <Router>
      <AuthProvider>
        {/* Skip-to-main link for keyboard users */}
        <a className="skip-to-main" href="#main-content">
          Skip to main content
        </a>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/help" element={<HelpCenter />} />
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
            path="/forgot-password"
            element={
              <PublicRoute>
                <ForgotPassword />
              </PublicRoute>
            }
          />
          <Route
            path="/reset-password"
            element={
              <PublicRoute>
                <ResetPassword />
              </PublicRoute>
            }
          />
          <Route
            path="/events"
            element={
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <Events />
                </AuthenticatedLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/events/:id"
            element={
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <EventDetail />
                </AuthenticatedLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/registrations"
            element={
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <MyRegistrations />
                </AuthenticatedLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AuthenticatedLayout>
                  <AdminDashboard />
                </AuthenticatedLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/organizer/dashboard"
            element={
              <ProtectedRoute allowedRoles={['organizer']}>
                <AuthenticatedLayout>
                  <OrganizerDashboard />
                </AuthenticatedLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/dashboard"
            element={
              <ProtectedRoute allowedRoles={['user']}>
                <AuthenticatedLayout>
                  <Dashboard />
                </AuthenticatedLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App
