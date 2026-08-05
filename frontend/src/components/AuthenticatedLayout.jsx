import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import EventProLogo from './EventProLogo'
import LogoutConfirmModal from './LogoutConfirmModal'

const roleLabel = {
  admin: 'Admin',
  organizer: 'Organizer',
  user: 'User',
}

const DASHBOARD_ROUTE = {
  admin: '/admin/dashboard',
  organizer: '/organizer/dashboard',
  user: '/user/dashboard',
}

const NAV_LINKS = {
  user: [
    { to: '/events', label: 'Events' },
    { to: '/user/registrations', label: 'My Registrations' },
  ],
  organizer: [
    { to: '/events', label: 'Events' },
    { to: '/organizer/dashboard', label: 'My Events' },
  ],
  admin: [
    { to: '/events', label: 'Events' },
  ],
}

const AuthenticatedLayout = ({ children }) => {
  const { user, logout } = useAuth()
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    window.location.href = '/'
  }

  const dashboardUrl = DASHBOARD_ROUTE[user?.role] || '/user/dashboard'
  const links = NAV_LINKS[user?.role] || []
  const badge = roleLabel[user?.role] || user?.role

  const closeMobileMenu = () => setMobileMenuOpen(false)

  return (
    <div className="min-h-screen bg-surface-bright flex flex-col">
      {/* Skip to main */}
      <a href="#main-content" className="skip-to-main">
        Skip to main content
      </a>

      {/* Top Nav */}
      <header className="sticky top-0 z-50 w-full p-lg border-b border-outline-variant bg-surface-container-lowest shadow-sm">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-xl">
            <Link to={dashboardUrl} onClick={closeMobileMenu}>
              <EventProLogo />
            </Link>
            <nav className="hidden md:flex items-center gap-lg" aria-label="Main navigation">
              <NavLink
                to={dashboardUrl}
                end
                className={({ isActive }) =>
                  `font-label-md transition-colors ${
                    isActive
                      ? 'text-primary border-b-2 border-primary pb-1'
                      : 'text-on-surface-variant hover:text-primary'
                  }`
                }
              >
                Dashboard
              </NavLink>
              {links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `font-label-md transition-colors ${
                      isActive
                        ? 'text-primary border-b-2 border-primary pb-1'
                        : 'text-on-surface-variant hover:text-primary'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-md">
            <span className="font-body-sm text-body-sm text-on-surface-variant hidden sm:inline">
              {user?.full_name}
            </span>
            <span className="px-sm py-xs rounded-full bg-primary-container text-on-primary font-label-sm text-label-sm uppercase">
              {badge}
            </span>
            <button
              onClick={() => setShowLogoutModal(true)}
              className="px-md py-sm border border-outline-variant rounded-lg font-label-md text-label-md text-on-surface hover:bg-surface-container transition-colors"
              aria-label="Logout"
            >
              Logout
            </button>
            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="md:hidden material-symbols-outlined p-sm rounded-full hover:bg-surface-container transition-colors text-on-surface-variant"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? 'close' : 'menu'}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav
            className="md:hidden mt-lg pt-lg border-t border-outline-variant flex flex-col gap-sm"
            aria-label="Mobile navigation"
          >
            <NavLink
              to={dashboardUrl}
              end
              onClick={closeMobileMenu}
              className={({ isActive }) =>
                `px-md py-sm rounded-lg font-label-md transition-colors ${
                  isActive
                    ? 'bg-primary-container text-on-primary'
                    : 'text-on-surface-variant hover:bg-surface-container'
                }`
              }
            >
              Dashboard
            </NavLink>
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={closeMobileMenu}
                className={({ isActive }) =>
                  `px-md py-sm rounded-lg font-label-md transition-colors ${
                    isActive
                      ? 'bg-primary-container text-on-primary'
                      : 'text-on-surface-variant hover:bg-surface-container'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <div className="border-t border-outline-variant my-sm" />
            <span className="px-md py-sm font-body-sm text-body-sm text-on-surface-variant">
              {user?.full_name}
            </span>
          </nav>
        )}
      </header>

      {/* Main Content */}
      <main id="main-content" className="max-w-[1440px] mx-auto p-lg sm:p-xl w-full flex-1">
        {children}
      </main>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <LogoutConfirmModal
          onClose={() => setShowLogoutModal(false)}
          onConfirm={handleLogout}
        />
      )}
    </div>
  )
}

export default AuthenticatedLayout
