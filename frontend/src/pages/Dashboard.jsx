import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import EventProLogo from '../components/EventProLogo'
import LogoutConfirmModal from '../components/LogoutConfirmModal'

const Dashboard = () => {
  const { user, logout } = useAuth()

  const [showLogoutModal, setShowLogoutModal] = useState(false)

  const roleLabel = {
    admin: 'Admin',
    organizer: 'Organizer',
    user: 'User',
  }

  const quickLinks = [
    {
      to: '/events',
      icon: 'calendar_today',
      title: 'Browse Events',
      description: 'Discover and explore upcoming events',
      roles: ['user'],
    },
    {
      to: '/user/registrations',
      icon: 'how_to_reg',
      title: 'My Registrations',
      description: 'View events you are registered for',
      roles: ['user'],
    },
    {
      to: '/events',
      icon: 'search',
      title: 'Search Events',
      description: 'Find events by keyword, date, or location',
      roles: ['user'],
    },
  ]

  const filteredLinks = quickLinks.filter(
    (link) => link.roles.includes(user?.role)
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Skip to main */}
      <a href="#dashboard-main" className="skip-to-main">
        Skip to dashboard content
      </a>

      {/* Top Nav */}
      <header className="w-full p-lg border-b border-outline-variant bg-surface-container-lowest">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between">
          <Link to="/user/dashboard"><EventProLogo /></Link>
          <div className="flex items-center gap-md">
            <span className="font-body-sm text-body-sm text-on-surface-variant hidden sm:inline">
              {user?.full_name}
            </span>
            <span className="px-sm py-xs rounded-full bg-primary-container text-on-primary font-label-sm text-label-sm uppercase">
              {roleLabel[user?.role] || user?.role}
            </span>
            <button
              onClick={() => setShowLogoutModal(true)}
              className="px-md py-sm border border-outline-variant rounded-lg font-label-md text-label-md text-on-surface hover:bg-surface-container transition-colors"
              aria-label="Logout"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main id="dashboard-main" className="max-w-[1440px] mx-auto p-lg sm:p-xl">
        <h1 className="font-headline-lg text-headline-lg text-on-surface mb-xs">
          Welcome, {user?.full_name || 'User'}
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant mb-xl">
          You are logged in as{' '}
          <strong className="text-primary">{roleLabel[user?.role] || user?.role}</strong>.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-lg">
          {filteredLinks.map((link) => (
            link.to !== '#' ? (
              <Link
                key={link.title}
                to={link.to}
                className="bg-surface-container-lowest rounded-xl border border-outline-variant p-lg hover:shadow-md hover:border-primary/30 transition-all block"
                aria-label={`Go to ${link.title}`}
              >
                <span className="material-symbols-outlined text-primary text-3xl mb-sm block" aria-hidden="true">{link.icon}</span>
                <h2 className="font-headline-sm text-headline-sm text-on-surface mb-xs">{link.title}</h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant">{link.description}</p>
              </Link>
            ) : (
              <div
                key={link.title}
                className="bg-surface-container-lowest rounded-xl border border-outline-variant p-lg opacity-75"
              >
                <span className="material-symbols-outlined text-primary text-3xl mb-sm block" aria-hidden="true">{link.icon}</span>
                <h2 className="font-headline-sm text-headline-sm text-on-surface mb-xs">{link.title}</h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant">{link.description}</p>
              </div>
            )
          ))}
        </div>
      </main>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <LogoutConfirmModal
          onClose={() => setShowLogoutModal(false)}
          onConfirm={logout}
        />
      )}
    </div>
  )
}

export default Dashboard
