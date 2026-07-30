import { useState, useEffect } from 'react'
import api from '../services/api'
import { useAuth } from '../hooks/useAuth'
import EventProLogo from '../components/EventProLogo'
import EventFormModal from '../components/EventFormModal'
import ParticipantsModal from '../components/ParticipantsModal'

const STATUS_STYLES = {
  approved: { bg: 'bg-green-100', text: 'text-green-700', label: 'Approved' },
  pending: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Pending' },
  rejected: { bg: 'bg-red-100', text: 'text-red-700', label: 'Rejected' },
}

const OrganizerDashboard = () => {
  const { user, logout } = useAuth()

  // Events state
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Notification state
  const [notification, setNotification] = useState(null)

  // Modal state
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingEvent, setEditingEvent] = useState(null)
  const [participantsModal, setParticipantsModal] = useState(null)
  const [deletingEventId, setDeletingEventId] = useState(null)
  const [deleting, setDeleting] = useState(false)

  // Form submission state
  const [submitting, setSubmitting] = useState(false)

  // Auto-dismiss notification
  useEffect(() => {
    if (!notification) return
    const timer = setTimeout(() => setNotification(null), 4000)
    return () => clearTimeout(timer)
  }, [notification])

  // Fetch events
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

  // Create event handler
  const handleCreate = async (formData) => {
    setSubmitting(true)
    try {
      await api.post('/api/events', formData)
      setShowCreateModal(false)
      setNotification({ type: 'success', text: 'Event created successfully! It is now pending approval.' })
      fetchEvents()
    } catch (err) {
      setNotification({
        type: 'error',
        text: err.response?.data?.detail || 'Failed to create event.',
      })
    } finally {
      setSubmitting(false)
    }
  }

  // Edit event handler
  const handleEdit = async (formData) => {
    if (!editingEvent) return
    setSubmitting(true)
    try {
      await api.put(`/api/events/${editingEvent.id}`, formData)
      setEditingEvent(null)
      setNotification({ type: 'success', text: 'Event updated successfully!' })
      fetchEvents()
    } catch (err) {
      setNotification({
        type: 'error',
        text: err.response?.data?.detail || 'Failed to update event.',
      })
    } finally {
      setSubmitting(false)
    }
  }

  // Delete event handler
  const handleDelete = async () => {
    if (!deletingEventId) return
    setDeleting(true)
    try {
      await api.delete(`/api/events/${deletingEventId}`)
      setDeletingEventId(null)
      setNotification({ type: 'success', text: 'Event deleted successfully.' })
      fetchEvents()
    } catch (err) {
      setNotification({
        type: 'error',
        text: err.response?.data?.detail || 'Failed to delete event.',
      })
    } finally {
      setDeleting(false)
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

  const getStats = () => {
    const total = events.length
    const approved = events.filter((e) => e.status === 'approved').length
    const pending = events.filter((e) => e.status === 'pending').length
    const rejected = events.filter((e) => e.status === 'rejected').length
    return { total, approved, pending, rejected }
  }

  const stats = getStats()

  return (
    <div className="min-h-screen bg-surface-bright">
      {/* Top Nav */}
      <header className="w-full p-lg border-b border-outline-variant bg-surface-container-lowest">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between">
          <EventProLogo />
          <div className="flex items-center gap-md">
            <span className="font-body-sm text-body-sm text-on-surface-variant">
              {user?.full_name}
            </span>
            <span className="px-sm py-xs rounded-full bg-primary-container text-on-primary font-label-sm text-label-sm uppercase">
              Organizer
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
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2xl gap-md">
          <div>
            <h1 className="font-headline-lg text-headline-lg text-on-surface mb-xs">
              Organizer Dashboard
            </h1>
            <p className="text-body-md text-on-surface-variant">
              Manage your events, view registrations, and track attendance.
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-xl py-md bg-primary text-on-primary rounded-lg font-label-md hover:bg-primary-container transition-colors shadow-md flex items-center gap-sm shrink-0"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            Create Event
          </button>
        </div>

        {/* Notification Banner */}
        {notification && (
          <div
            className={`mb-xl px-lg py-md rounded-xl flex items-center gap-sm font-label-md transition-all ${
              notification.type === 'success'
                ? 'bg-green-50 border border-green-200 text-green-700'
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">
              {notification.type === 'success' ? 'check_circle' : 'error'}
            </span>
            {notification.text}
            <button
              onClick={() => setNotification(null)}
              className="ml-auto material-symbols-outlined text-[18px] opacity-60 hover:opacity-100"
            >
              close
            </button>
          </div>
        )}

        {/* Stats Cards */}
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

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-3xl">
            <span className="material-symbols-outlined animate-spin text-4xl text-primary mb-md">sync</span>
            <p className="text-body-md text-on-surface-variant">Loading your events...</p>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="flex flex-col items-center justify-center py-3xl">
            <span className="material-symbols-outlined text-4xl text-error mb-md">error</span>
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
        {!loading && !error && events.length === 0 && (
          <div className="flex flex-col items-center justify-center py-3xl">
            <span className="material-symbols-outlined text-5xl text-outline-variant mb-md">event_busy</span>
            <p className="text-headline-sm text-on-surface mb-xs">No events yet</p>
            <p className="text-body-sm text-on-surface-variant mb-lg">
              Create your first event to get started.
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-xl py-md bg-primary text-on-primary rounded-lg font-label-md hover:bg-primary-container transition-colors shadow-md"
            >
              Create Event
            </button>
          </div>
        )}

        {/* Events List */}
        {!loading && !error && events.length > 0 && (
          <div className="space-y-md">
            {events.map((event) => {
              const status = STATUS_STYLES[event.status] || STATUS_STYLES.pending
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
                          <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                          {formatDate(event.date)}
                        </span>
                        <span className="flex items-center gap-xs">
                          <span className="material-symbols-outlined text-[16px]">schedule</span>
                          {formatTime(event.time)}
                        </span>
                        <span className="flex items-center gap-xs">
                          <span className="material-symbols-outlined text-[16px]">location_on</span>
                          {event.location}
                        </span>
                        <span className="flex items-center gap-xs">
                          <span className="material-symbols-outlined text-[16px]">group</span>
                          {event.capacity} capacity
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-sm shrink-0">
                      <button
                        onClick={() => setParticipantsModal({ id: event.id, title: event.title })}
                        className="px-md py-sm border border-outline-variant rounded-lg font-label-md text-label-md text-on-surface hover:bg-surface-container transition-colors flex items-center gap-xs"
                        title="View Participants"
                      >
                        <span className="material-symbols-outlined text-[18px]">group</span>
                        <span className="hidden sm:inline">Participants</span>
                      </button>
                      <button
                        onClick={() => setEditingEvent(event)}
                        className="px-md py-sm border border-primary/30 text-primary rounded-lg font-label-md text-label-md hover:bg-primary-fixed transition-colors flex items-center gap-xs"
                        title="Edit Event"
                      >
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                        <span className="hidden sm:inline">Edit</span>
                      </button>
                      <button
                        onClick={() => setDeletingEventId(event.id)}
                        className="px-md py-sm border border-error/30 text-error rounded-lg font-label-md text-label-md hover:bg-error-container/20 transition-colors flex items-center gap-xs"
                        title="Delete Event"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                        <span className="hidden sm:inline">Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}

            {/* Total count */}
            <div className="text-center pt-md">
              <p className="text-body-sm text-on-surface-variant">
                Showing {events.length} event{events.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Create Event Modal */}
      {showCreateModal && (
        <EventFormModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreate}
          submitting={submitting}
        />
      )}

      {/* Edit Event Modal */}
      {editingEvent && (
        <EventFormModal
          event={editingEvent}
          onClose={() => setEditingEvent(null)}
          onSubmit={handleEdit}
          submitting={submitting}
        />
      )}

      {/* Participants Modal */}
      {participantsModal && (
        <ParticipantsModal
          eventId={participantsModal.id}
          eventTitle={participantsModal.title}
          onClose={() => setParticipantsModal(null)}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {deletingEventId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-md bg-black/40 backdrop-blur-sm">
          <div className="bg-surface rounded-2xl shadow-xl w-full max-w-sm p-xl">
            <div className="flex items-center gap-sm mb-lg">
              <span className="material-symbols-outlined text-3xl text-error">warning</span>
              <h2 className="font-headline-md text-headline-md text-on-surface">
                Delete Event
              </h2>
            </div>
            <p className="text-body-md text-on-surface-variant mb-lg">
              Are you sure you want to delete this event? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-md">
              <button
                onClick={() => setDeletingEventId(null)}
                className="px-xl py-sm border border-outline-variant rounded-lg font-label-md text-on-surface hover:bg-surface-container transition-colors"
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-xl py-sm bg-error text-on-error rounded-lg font-label-md hover:bg-red-700 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-sm"
                disabled={deleting}
              >
                {deleting && (
                  <span className="material-symbols-outlined animate-spin text-[18px]">sync</span>
                )}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default OrganizerDashboard
