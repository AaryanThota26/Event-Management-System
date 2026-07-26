import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import EventProLogo from '../components/EventProLogo'

const Dashboard = () => {
  const { user, logout } = useAuth()

  const roleLabel = {
    admin: 'Admin',
    organizer: 'Organizer',
    user: 'User',
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top Nav */}
      <header className="w-full p-lg border-b border-outline-variant bg-surface-container-lowest">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between">
          <EventProLogo />
          <div className="flex items-center gap-md">
            <span className="font-body-sm text-body-sm text-on-surface-variant">
              {user?.full_name}
            </span>
            <span className="px-sm py-xs rounded-full bg-primary-container text-on-primary font-label-sm text-label-sm uppercase">
              {roleLabel[user?.role] || user?.role}
            </span>
            <button
              onClick={logout}
              className="px-md py-sm border border-outline-variant rounded-lg font-label-md text-label-md text-on-surface hover:bg-surface-container transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1440px] mx-auto p-xl">
        <h1 className="font-headline-lg text-headline-lg text-on-surface mb-xs">
          Welcome, {user?.full_name || 'User'}
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant mb-xl">
          You are logged in as{' '}
          <strong className="text-primary">{roleLabel[user?.role] || user?.role}</strong>.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-lg">
          <Link to="/events" className="bg-surface-container-lowest rounded-xl border border-outline-variant p-lg hover:shadow-md hover:border-primary/30 transition-all block">
            <span className="material-symbols-outlined text-primary text-3xl mb-sm">calendar_today</span>
            <h2 className="font-headline-sm text-headline-sm text-on-surface mb-xs">Events</h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant">Browse and manage events</p>
          </Link>
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-lg">
            <span className="material-symbols-outlined text-primary text-3xl mb-sm">group</span>
            <h2 className="font-headline-sm text-headline-sm text-on-surface mb-xs">Registrations</h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant">Track event registrations</p>
          </div>
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-lg">
            <span className="material-symbols-outlined text-primary text-3xl mb-sm">bar_chart</span>
            <h2 className="font-headline-sm text-headline-sm text-on-surface mb-xs">Analytics</h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant">View event analytics</p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Dashboard
