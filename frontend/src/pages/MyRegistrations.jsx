import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'

const MyRegistrations = () => {
  const [registrations, setRegistrations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchRegistrations = async () => {
      setLoading(true)
      setError('')
      try {
        const { data } = await api.get('/api/registrations/my', {
          params: { limit: 100 },
        })
        setRegistrations(data)
      } catch (err) {
        setError(err.response?.data?.detail || 'Failed to load your registrations.')
      } finally {
        setLoading(false)
      }
    }
    fetchRegistrations()
  }, [])

  const formatDate = (dateStr) => {
    const d = new Date(dateStr + 'T00:00:00')
    return d.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const formatTime = (timeStr) => {
    const [h, m] = timeStr.split(':')
    const hr = parseInt(h)
    const ampm = hr >= 12 ? 'PM' : 'AM'
    const hr12 = hr % 12 || 12
    return `${hr12}:${m} ${ampm}`
  }

  const formatRegistrationDate = (dateStr) => {
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    })
  }

  return (
    <div className="min-h-screen bg-surface-bright">
      {/* Top Nav */}
      <header className="sticky top-0 z-50 flex justify-between items-center w-full px-lg py-sm bg-surface border-b border-outline-variant shadow-sm">
        <div className="flex items-center gap-xl">
          <span className="font-headline-md text-headline-md font-bold text-primary">EventPro</span>
          <nav className="hidden md:flex items-center gap-lg">
            <a className="text-on-surface-variant hover:text-primary transition-colors font-label-md" href="/user/dashboard">Dashboard</a>
            <a className="text-on-surface-variant hover:text-primary transition-colors font-label-md" href="/events">Events</a>
            <a className="text-primary border-b-2 border-primary pb-1 font-medium font-label-md" href="/user/registrations">My Registrations</a>
          </nav>
        </div>
      </header>

      <main className="max-w-[1440px] mx-auto p-xl">
        {/* Hero */}
        <div className="mb-2xl">
          <h1 className="font-display-lg text-display-lg text-on-background mb-sm">My Registrations</h1>
          <p className="text-body-lg text-on-surface-variant max-w-2xl">
            View and manage all the events you are registered for.
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-3xl">
            <span className="material-symbols-outlined animate-spin text-4xl text-primary mb-md">sync</span>
            <p className="text-body-md text-on-surface-variant">Loading your registrations...</p>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="flex flex-col items-center justify-center py-3xl">
            <span className="material-symbols-outlined text-4xl text-error mb-md">error</span>
            <p className="text-body-md text-error mb-md">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-lg py-sm bg-primary text-on-primary rounded-lg font-label-md hover:bg-primary-container transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && registrations.length === 0 && (
          <div className="flex flex-col items-center justify-center py-3xl">
            <span className="material-symbols-outlined text-5xl text-outline-variant mb-md">event_busy</span>
            <p className="text-headline-sm text-on-surface mb-xs">No registrations yet</p>
            <p className="text-body-sm text-on-surface-variant mb-lg">
              You have not registered for any events. Browse available events to get started.
            </p>
            <Link
              to="/events"
              className="px-xl py-md bg-primary text-on-primary rounded-lg font-label-md hover:bg-primary-container transition-colors shadow-md"
            >
              Browse Events
            </Link>
          </div>
        )}

        {/* Registrations List */}
        {!loading && !error && registrations.length > 0 && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-xl">
              {registrations.map((reg) => (
                <Link
                  key={reg.id}
                  to={`/events/${reg.event.id}`}
                  className="group bg-surface-container-lowest border border-outline-variant rounded-2xl p-xl hover:shadow-lg transition-all duration-300 block"
                >
                  <div className="flex items-start justify-between mb-md">
                    <h3 className="font-headline-sm text-headline-sm text-on-surface group-hover:text-primary transition-colors line-clamp-1 flex-1 mr-md">
                      {reg.event.title}
                    </h3>
                    <span className="material-symbols-outlined text-primary text-[20px] mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      arrow_forward
                    </span>
                  </div>

                  <p className="text-body-sm text-on-surface-variant mb-lg line-clamp-2">
                    {reg.event.description}
                  </p>

                  <div className="space-y-sm mb-lg">
                    <div className="flex items-center gap-sm text-on-surface-variant text-label-md">
                      <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                      {formatDate(reg.event.date)}
                    </div>
                    <div className="flex items-center gap-sm text-on-surface-variant text-label-md">
                      <span className="material-symbols-outlined text-[18px]">schedule</span>
                      {formatTime(reg.event.time)}
                    </div>
                    <div className="flex items-center gap-sm text-on-surface-variant text-label-md">
                      <span className="material-symbols-outlined text-[18px]">location_on</span>
                      {reg.event.location}
                    </div>
                  </div>

                  <div className="pt-md border-t border-outline-variant flex items-center gap-sm">
                    <span className="material-symbols-outlined text-[16px] text-green-600">check_circle</span>
                    <span className="text-body-sm text-green-600 font-medium">
                      Registered {formatRegistrationDate(reg.registered_at)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            {/* Total count */}
            <div className="mt-xl text-center">
              <p className="text-body-sm text-on-surface-variant">
                You are registered for {registrations.length} event{registrations.length !== 1 ? 's' : ''}
              </p>
            </div>
          </>
        )}
      </main>
    </div>
  )
}

export default MyRegistrations
