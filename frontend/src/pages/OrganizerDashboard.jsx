import { useState, useEffect } from 'react'
import api from '../services/api'
import { useAuth } from '../hooks/useAuth'
import EventFormModal from '../components/EventFormModal'
import ParticipantsModal from '../components/ParticipantsModal'
import SkeletonLoader from '../components/SkeletonLoader'

const STATUS_STYLES = {
  approved: { bg: 'bg-green-100', text: 'text-green-700', label: 'Approved' },
  pending: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Pending' },
  rejected: { bg: 'bg-red-100', text: 'text-red-700', label: 'Rejected' },
}

const OrganizerDashboard = () => {
  const { user } = useAuth()

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
    <>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-xl gap-md">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface mb-xs">
            Welcome, {user?.full_name || 'Organizer'}
          </h1>
          <p className="text-body-md text-on-surface-variant">
            You are logged in as <strong className="text-primary">Organizer</strong>.
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="w-full sm:w-auto px-xl py-md bg-primary text-on-primary rounded-lg font-label-md hover:bg-primary-container transition-colors shadow-md flex items-center justify-center gap-sm shrink-0"
        >
          <span className="material-symbols-outlined text-[20px]" aria-hidden="true">add</span>
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-md mb-xl">
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
        {!loading && !error && events.length === 0 && (
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <span className="material-symbols-outlined text-6xl text-outline-variant mb-md" aria-hidden="true">event_busy</span>
            <p className="font-headline-sm text-headline-sm text-on-surface mb-xs">No events yet</p>
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

                  {/* Actions */}
                  <div className="flex items-center gap-sm shrink-0">
                    <button
                      onClick={() => setParticipantsModal({ id: event.id, title: event.title })}
                      className="px-md py-sm border border-outline-variant rounded-lg font-label-md text-label-md text-on-surface hover:bg-surface-container transition-colors flex items-center gap-xs"
                      aria-label={`View participants for ${event.title}`}
                    >
                      <span className="material-symbols-outlined text-[18px]" aria-hidden="true">group</span>
                      <span className="hidden sm:inline">Participants</span>
                    </button>
                    <button
                      onClick={() => setEditingEvent(event)}
                      className="px-md py-sm border border-primary/30 text-primary rounded-lg font-label-md text-label-md hover:bg-primary-fixed transition-colors flex items-center gap-xs"
                      aria-label={`Edit ${event.title}`}
                    >
                      <span className="material-symbols-outlined text-[18px]" aria-hidden="true">edit</span>
                      <span className="hidden sm:inline">Edit</span>
                    </button>
                    <button
                      onClick={() => setDeletingEventId(event.id)}
                      className="px-md py-sm border border-error/30 text-error rounded-lg font-label-md text-label-md hover:bg-error-container/20 transition-colors flex items-center gap-xs"
                      aria-label={`Delete ${event.title}`}
                    >
                      <span className="material-symbols-outlined text-[18px]" aria-hidden="true">delete</span>
                      <span className="hidden sm:inline">Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            )
          })}

          {/* Total count */}
          <div className="mt-xl text-center">
            <p className="text-body-sm text-on-surface-variant">
              Showing {events.length} event{events.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      )}
      </div>

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
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-md bg-black/40 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-dialog-title"
        >
          <div className="bg-surface rounded-2xl shadow-xl w-full max-w-sm p-xl">
            <div className="flex items-center gap-sm mb-lg">
              <span className="material-symbols-outlined text-3xl text-error" aria-hidden="true">warning</span>
              <h2 id="delete-dialog-title" className="font-headline-md text-headline-md text-on-surface">
                Delete Event
              </h2>
            </div>
            <p className="text-body-md text-on-surface-variant mb-lg">
              Are you sure you want to delete this event? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-md">
              <button
                onClick={() => setDeletingEventId(null)}
                className="flex-1 sm:flex-none px-xl py-sm border border-outline-variant rounded-lg font-label-md text-on-surface hover:bg-surface-container transition-colors"
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 sm:flex-none px-xl py-sm bg-error text-on-error rounded-lg font-label-md hover:bg-red-700 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-sm"
                disabled={deleting}
              >
                {deleting && (
                  <span className="material-symbols-outlined animate-spin text-[18px]" aria-hidden="true">sync</span>
                )}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default OrganizerDashboard
