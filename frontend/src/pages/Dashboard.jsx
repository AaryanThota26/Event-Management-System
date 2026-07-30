import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const roleLabel = {
  admin: 'Admin',
  organizer: 'Organizer',
  user: 'User',
}

const Dashboard = () => {
  const { user } = useAuth()

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
    <>
      <div className="mb-xl">
        <h1 className="font-headline-lg text-headline-lg text-on-surface mb-xs">
          Welcome, {user?.full_name || 'User'}
        </h1>
        <p className="text-body-md text-on-surface-variant">
          You are logged in as{' '}
          <strong className="text-primary">{roleLabel[user?.role] || user?.role}</strong>.
        </p>
      </div>

      <div className="min-h-[400px]">
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
      </div>
    </>
  )
}

export default Dashboard
