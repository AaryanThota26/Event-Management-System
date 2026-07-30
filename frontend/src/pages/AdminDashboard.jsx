import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import { useAuth } from '../hooks/useAuth'
import EventProLogo from '../components/EventProLogo'
import SkeletonLoader from '../components/SkeletonLoader'
import LogoutConfirmModal from '../components/LogoutConfirmModal'

const STATUS_STYLES = {
  approved: { bg: 'bg-green-100', text: 'text-green-700', label: 'Approved' },
  pending: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Pending' },
  rejected: { bg: 'bg-red-100', text: 'text-red-700', label: 'Rejected' },
}

const roleLabel = {
  admin: 'Admin',
  organizer: 'Organizer',
  user: 'User',
}

const FILTERS = [
  { key: 'all', label: 'All Events' },
  { key: 'pending', label: 'Pending' },
  { key: 'approved', label: 'Approved' },
  { key: 'rejected', label: 'Rejected' },
]

const AdminDashboard = () => {
  const { user, logout } = useAuth()

  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notification, setNotification] = useState(null)
  const [statusFilter, setStatusFilter] = useState('all')

  // Track which event ids have a pending action
  const [actioning, setActioning] = useState({})
  const [showLogoutModal, setShowLogoutModal] = useState(false)

  // Auto-dismiss notification
  useEffect(() => {
    if (!notification) return
    const timer = setTimeout(() => setNotification(null), 4000)
    return () => clearTimeout(timer)
  }, [notification])

  // Fetch all events
  const fetchEvents = async () => {
    setLoading(true)
    setError('')
    try {
      const { data } = await api.get('/api/events', { params: { limit: 100 } })
      setEvents(data.events || [])
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load events.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEvents()
  }, [])

  // Approve event — immediate state update, no refetch
  const handleApprove = async (eventId) => {
    setActioning((prev) => ({ ...prev, [eventId]: 'approve' }))
    setNotification(null)
    try {
      const { data } = await api.patch(`/api/events/${eventId}/approve`)
      // Optimistic update: replace the event in-place
      setEvents((prev) =>
        prev.map((e) => (e.id === eventId ? { ...e, status: data.status } : e))
      )
      setNotification({ type: 'success', text: 'Event approved successfully.' })
    } catch (err) {
      setNotification({
        type: 'error',
        text: err.response?.data?.detail || 'Failed to approve event.',
      })
    } finally {
      setActioning((prev) => {
        const next = { ...prev }
        delete next[eventId]
        return next
      })
    }
  }

  // Reject event — immediate state update, no refetch
  const handleReject = async (eventId) => {
    setActioning((prev) => ({ ...prev, [eventId]: 'reject' }))
    setNotification(null)
    try {
      const { data } = await api.patch(`/api/events/${eventId}/reject`)
      setEvents((prev) =>
        prev.map((e) => (e.id === eventId ? { ...e, status: data.status } : e))
      )
      setNotification({ type: 'success', text: 'Event rejected.' })
    } catch (err) {
      setNotification({
        type: 'error',
        text: err.response?.data?.detail || 'Failed to reject event.',
      })
    } finally {
      setActioning((prev) => {
        const next = { ...prev }
        delete next[eventId]
        return next
      })
    }
  }

  const formatDate = (dateStr) => {
    const d = new Date(dateStr + 'T00:00:00')
    return d.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const formatTime = (timeStr) => {
    if (!timeStr) return ''
    const [h, m] = timeStr.split(':')
    const hr = parseInt(h)
    const ampm = hr >= 12 ? 'PM' : 'AM'
    const hr12 = hr % 12 || 12
    return `${hr12}:${m} ${ampm}`
  }

  const filtered =
    statusFilter === 'all'
      ? events
      : events.filter((e) => e.status === statusFilter)

  const stats = {
    total: events.length,
    approved: events.filter((e) => e.status === 'approved').length,
    pending: events.filter((e) => e.status === 'pending').length,
    rejected: events.filter((e) => e.status === 'rejected').length,
  }

  return (
    <div className="min-h-screen bg-surface-bright">
      {/* Skip to main */}
      <a href="#admin-main" className="skip-to-main">
        Skip to admin dashboard
      </a>

      {/* Top Nav */}
      <header className="w-full p-lg border-b border-outline-variant bg-surface-container-lowest">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between">
          <Link to="/admin/dashboard"><EventProLogo /></Link>
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
      <main id="admin-main" className="max-w-[1440px] mx-auto p-lg sm:p-xl">
        {/* Page Header */}
        <div className="mb-2xl">
          <h1 className="font-headline-lg text-headline-lg text-on-surface mb-xs">
            Welcome, {user?.full_name || 'Admin'}
          </h1>
          <p className="text-body-md text-on-surface-variant">
            You are logged in as <strong className="text-primary">Admin</strong>.
          </p>
        </div>

        {/* Notification Banner */}
        {notification && (
          <div
            className={`mb-xl px-lg py-md rounded-xl flex items-center gap-sm font-label-md transition-all ${
              notification.type === 'success'
                ? 'bg-green-50 border border-green-200 text-green-700'
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}
            role="alert"
          >
            <span className="material-symbols-outlined text-[20px]" aria-hidden="true">
              {notification.type === 'success' ? 'check_circle' : 'error'}
            </span>
            <span className="flex-1">{notification.text}</span>
            <button
              onClick={() => setNotification(null)}
              className="material-symbols-outlined text-[18px] opacity-60 hover:opacity-100"
              aria-label="Dismiss notification"
            >
              close
            </button>
          </div>
        )}

        {/* Stats Cards */}
        {loading ? (
          <SkeletonLoader type="stats" />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-md mb-2xl">
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-lg">
              <p className="font-display-lg text-display-lg text-primary mb-xs">{stats.total}</p>
              <p className="font-body-sm text-body-sm text-on-surface-variant">Total Events</p>
            </div>
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-lg">
              <p className="font-display-lg text-display-lg text-green-600 mb-xs">{stats.approved}</p>
              <p className="font-body-sm text-body-sm text-on-surface-variant">Approved</p>
            </div>
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-lg">
              <p className="font-display-lg text-display-lg text-amber-600 mb-xs">{stats.pending}</p>
              <p className="font-body-sm text-body-sm text-on-surface-variant">Pending</p>
            </div>
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-lg">
              <p className="font-display-lg text-display-lg text-red-600 mb-xs">{stats.rejected}</p>
              <p className="font-body-sm text-body-sm text-on-surface-variant">Rejected</p>
            </div>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-sm mb-xl" role="group" aria-label="Status filters">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setStatusFilter(f.key)}
              className={
                statusFilter === f.key
                  ? 'px-lg py-sm bg-primary text-on-primary rounded-full font-label-md shadow-md border border-transparent transition-all'
                  : 'px-lg py-sm bg-surface-container-lowest text-on-surface-variant border border-outline-variant rounded-full font-label-md hover:bg-surface-container-high transition-all'
              }
              aria-pressed={statusFilter === f.key}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Content Area — stable min-height prevents layout shift */}
        <div className="min-h-[400px]">
          {/* Loading State */}
          {loading && <SkeletonLoader type="list-item" count={4} />}

          {/* Error State */}
          {!loading && error && (
            <div className="flex flex-col items-center justify-center min-h-[400px]" role="alert">
              <span className="material-symbols-outlined text-4xl text-error mb-md" aria-hidden="true">error</span>
              <p className="text-body-md text-error mb-md">{error}</p>
              <button
                onClick={fetchEvents}
                className="px-lg py-sm bg-primary text-on-primary rounded-lg font-label-md hover:bg-primary-container transition-colors"
              >
                Retry
              </button>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
              <span className="material-symbols-outlined text-6xl text-outline-variant mb-md" aria-hidden="true">
                {events.length === 0 ? 'event_busy' : 'filter_alt_off'}
              </span>
              <p className="font-headline-sm text-headline-sm text-on-surface mb-xs">
                {events.length === 0 ? 'No events in the system' : 'No events match this filter'}
              </p>
              <p className="text-body-sm text-on-surface-variant text-center max-w-md">
                {events.length === 0
                  ? 'Events will appear here once organizers create them.'
                  : 'Try selecting a different filter tab above.'}
              </p>
            </div>
          )}

          {/* Events List */}
          {!loading && !error && filtered.length > 0 && (
          <div className="space-y-md">
            {filtered.map((event) => {
              const status = STATUS_STYLES[event.status] || STATUS_STYLES.pending
              const isPending = event.status === 'pending'
              const busyWith = actioning[event.id]

              return (
                <div
                  key={event.id}
                  className="bg-surface-container-lowest rounded-xl border border-outline-variant p-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-md">
                    {/* Event Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-sm mb-sm flex-wrap">
                        <h3 className="font-headline-sm text-headline-sm text-on-surface truncate">
                          {event.title}
                        </h3>
                        <span className={`px-sm py-xs rounded-lg text-label-sm font-bold ${status.bg} ${status.text}`}>
                          {status.label}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-x-lg gap-y-sm text-body-sm text-on-surface-variant">
                        <span className="flex items-center gap-xs">
                          <span className="material-symbols-outlined text-[16px]" aria-hidden="true">calendar_today</span>
                          {formatDate(event.date)}
                        </span>
                        <span className="flex items-center gap-xs">
                          <span className="material-symbols-outlined text-[16px]" aria-hidden="true">schedule</span>
                          {formatTime(event.time)}
                        </span>
                        <span className="flex items-center gap-xs">
                          <span className="material-symbols-outlined text-[16px]" aria-hidden="true">location_on</span>
                          {event.location}
                        </span>
                        <span className="flex items-center gap-xs">
                          <span className="material-symbols-outlined text-[16px]" aria-hidden="true">group</span>
                          {event.capacity} capacity
                        </span>
                      </div>
                    </div>

                    {/* Approve / Reject Actions — only for pending events */}
                    {isPending && (
                      <div className="flex items-center gap-sm shrink-0">
                        <button
                          onClick={() => handleApprove(event.id)}
                          disabled={!!busyWith}
                          className="flex-1 sm:flex-none px-md py-sm bg-green-600 text-white rounded-lg font-label-md text-label-md hover:bg-green-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-xs"
                          aria-label={`Approve ${event.title}`}
                        >
                          {busyWith === 'approve' ? (
                            <span className="material-symbols-outlined animate-spin text-[18px]" aria-hidden="true">sync</span>
                          ) : (
                            <span className="material-symbols-outlined text-[18px]" aria-hidden="true">check</span>
                          )}
                          <span className="hidden sm:inline">Approve</span>
                        </button>
                        <button
                          onClick={() => handleReject(event.id)}
                          disabled={!!busyWith}
                          className="flex-1 sm:flex-none px-md py-sm border border-error/30 text-error rounded-lg font-label-md text-label-md hover:bg-error-container/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-xs"
                          aria-label={`Reject ${event.title}`}
                        >
                          {busyWith === 'reject' ? (
                            <span className="material-symbols-outlined animate-spin text-[18px]" aria-hidden="true">sync</span>
                          ) : (
                            <span className="material-symbols-outlined text-[18px]" aria-hidden="true">close</span>
                          )}
                          <span className="hidden sm:inline">Reject</span>
                        </button>
                      </div>
                    )}

                    {/* Non-pending events: show a small status indicator instead of actions */}
                    {!isPending && (
                      <div className="shrink-0">
                        <span className={`inline-block px-md py-sm rounded-lg text-label-md font-bold ${status.bg} ${status.text}`}>
                          {status.label}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}

            {/* Total count */}
            <div className="text-center pt-md">
              <p className="text-body-sm text-on-surface-variant">
                Showing {filtered.length} of {events.length} event{events.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        )}
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

export default AdminDashboard
