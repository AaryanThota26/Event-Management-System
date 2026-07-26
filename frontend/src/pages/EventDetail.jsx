import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../services/api'
import { useAuth } from '../hooks/useAuth'

const STATUS_STYLES = {
  approved: { bg: 'bg-green-100', text: 'text-green-700', label: 'Approved' },
  pending: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Pending' },
  rejected: { bg: 'bg-red-100', text: 'text-red-700', label: 'Rejected' },
}

const EventDetail = () => {
  const { id } = useParams()
  const { user } = useAuth()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Registration state
  const [isRegistered, setIsRegistered] = useState(false)
  const [checkingRegistration, setCheckingRegistration] = useState(false)
  const [registering, setRegistering] = useState(false)
  const [notification, setNotification] = useState(null)

  // Fetch event details
  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true)
      setError('')
      try {
        const { data } = await api.get(`/api/events/${id}`)
        setEvent(data)
      } catch (err) {
        setError(err.response?.data?.detail || 'Failed to load event details.')
      } finally {
        setLoading(false)
      }
    }
    fetchEvent()
  }, [id])

  // Check if user is already registered for this event
  useEffect(() => {
    if (!user || user.role !== 'user' || !id) return

    const checkRegistration = async () => {
      setCheckingRegistration(true)
      try {
        const { data } = await api.get('/api/registrations/my', {
          params: { limit: 100 },
        })
        const registered = data.some(
          (reg) => String(reg.event.id) === String(id)
        )
        setIsRegistered(registered)
      } catch {
        // Silently fail — register button will still work
      } finally {
        setCheckingRegistration(false)
      }
    }
    checkRegistration()
  }, [user, id])

  // Handle register
  const handleRegister = async () => {
    setRegistering(true)
    setNotification(null)
    try {
      await api.post(`/api/events/${id}/register`)
      setIsRegistered(true)
      setNotification({ type: 'success', text: 'Successfully registered for this event!' })
    } catch (err) {
      setNotification({
        type: 'error',
        text: err.response?.data?.detail || 'Failed to register. Please try again.',
      })
    } finally {
      setRegistering(false)
    }
  }

  // Handle cancel registration
  const handleCancel = async () => {
    setRegistering(true)
    setNotification(null)
    try {
      await api.delete(`/api/events/${id}/register`)
      setIsRegistered(false)
      setNotification({ type: 'success', text: 'Registration cancelled successfully.' })
    } catch (err) {
      setNotification({
        type: 'error',
        text: err.response?.data?.detail || 'Failed to cancel registration. Please try again.',
      })
    } finally {
      setRegistering(false)
    }
  }

  // Auto-dismiss notification after 4 seconds
  useEffect(() => {
    if (!notification) return
    const timer = setTimeout(() => setNotification(null), 4000)
    return () => clearTimeout(timer)
  }, [notification])

  const formatDate = (dateStr) => {
    const d = new Date(dateStr + 'T00:00:00')
    return d.toLocaleDateString('en-US', {
      weekday: 'long',
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

  const canRegister = user && user.role === 'user'

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-surface-bright">
        <span className="material-symbols-outlined animate-spin text-4xl text-primary mb-md">sync</span>
        <p className="text-body-md text-on-surface-variant">Loading event details...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-surface-bright">
        <span className="material-symbols-outlined text-4xl text-error mb-md">error</span>
        <p className="text-body-md text-error mb-md">{error}</p>
        <Link
          to="/events"
          className="px-lg py-sm bg-primary text-on-primary rounded-lg font-label-md hover:bg-primary-container transition-colors"
        >
          Back to Events
        </Link>
      </div>
    )
  }

  if (!event) return null

  const status = STATUS_STYLES[event.status] || STATUS_STYLES.pending

  return (
    <div className="min-h-screen bg-surface-bright">
      {/* Top Nav */}
      <header className="sticky top-0 z-50 flex justify-between items-center w-full px-lg py-sm bg-surface border-b border-outline-variant shadow-sm">
        <div className="flex items-center gap-xl">
          <span className="font-headline-md text-headline-md font-bold text-primary">EventPro</span>
          <nav className="hidden md:flex items-center gap-lg">
            <a className="text-on-surface-variant hover:text-primary transition-colors font-label-md" href="/user/dashboard">Dashboard</a>
            <a className="text-on-surface-variant hover:text-primary transition-colors font-label-md" href="/events">Events</a>
            {canRegister && (
              <a className="text-on-surface-variant hover:text-primary transition-colors font-label-md" href="/user/registrations">My Registrations</a>
            )}
          </nav>
        </div>
      </header>

      <main className="max-w-[960px] mx-auto p-xl">
        {/* Back link */}
        <Link
          to="/events"
          className="inline-flex items-center gap-xs text-primary font-label-md hover:underline mb-xl"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          Back to Events
        </Link>

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

        {/* Hero Banner */}
        <div className="rounded-2xl bg-gradient-to-br from-primary-container via-primary to-inverse-surface p-2xl mb-xl relative overflow-hidden">
          <div className="absolute -right-16 -top-16 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="relative">
            <div className="flex items-center gap-sm mb-md">
              <span className={`px-md py-xs text-label-sm font-bold rounded-lg ${status.bg} ${status.text}`}>
                {status.label}
              </span>
            </div>
            <h1 className="font-display-lg text-display-lg text-white mb-md">{event.title}</h1>
            <p className="text-body-lg text-white/80 max-w-2xl">{event.description}</p>
          </div>
        </div>

        {/* Registration Action Card — only for 'user' role */}
        {canRegister && (
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-lg mb-xl">
            <div className="flex items-center justify-between flex-wrap gap-md">
              <div className="flex items-center gap-sm">
                <span className="material-symbols-outlined text-primary">
                  {isRegistered ? 'how_to_reg' : 'person_add'}
                </span>
                <div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface">
                    {isRegistered ? 'You are registered' : 'Ready to attend?'}
                  </h3>
                  <p className="text-body-sm text-on-surface-variant">
                    {isRegistered
                      ? 'You have a spot reserved for this event.'
                      : 'Register now to secure your spot.'}
                  </p>
                </div>
              </div>

              {checkingRegistration ? (
                <span className="text-body-sm text-on-surface-variant">Checking status...</span>
              ) : isRegistered ? (
                <button
                  onClick={handleCancel}
                  disabled={registering}
                  className="px-xl py-sm bg-red-50 text-red-600 border border-red-200 rounded-lg font-label-md hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-sm"
                >
                  {registering ? (
                    <>
                      <span className="material-symbols-outlined animate-spin text-[18px]">sync</span>
                      Cancelling...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[18px]">cancel</span>
                      Cancel Registration
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={handleRegister}
                  disabled={registering}
                  className="px-xl py-sm bg-primary text-on-primary rounded-lg font-label-md hover:bg-primary-container transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-sm shadow-md"
                >
                  {registering ? (
                    <>
                      <span className="material-symbols-outlined animate-spin text-[18px]">sync</span>
                      Registering...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[18px]">app_registration</span>
                      Register
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        )}

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-lg mb-xl">
          {/* Date & Time */}
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-lg">
            <div className="flex items-center gap-sm mb-md">
              <span className="material-symbols-outlined text-primary">calendar_today</span>
              <h3 className="font-headline-sm text-headline-sm text-on-surface">Date & Time</h3>
            </div>
            <p className="text-body-md text-on-surface mb-xs">{formatDate(event.date)}</p>
            <p className="text-body-sm text-on-surface-variant">{formatTime(event.time)}</p>
          </div>

          {/* Location */}
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-lg">
            <div className="flex items-center gap-sm mb-md">
              <span className="material-symbols-outlined text-primary">location_on</span>
              <h3 className="font-headline-sm text-headline-sm text-on-surface">Location</h3>
            </div>
            <p className="text-body-md text-on-surface">{event.location}</p>
          </div>

          {/* Capacity */}
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-lg">
            <div className="flex items-center gap-sm mb-md">
              <span className="material-symbols-outlined text-primary">group</span>
              <h3 className="font-headline-sm text-headline-sm text-on-surface">Capacity</h3>
            </div>
            <p className="text-body-md text-on-surface">{event.capacity} attendees</p>
          </div>

          {/* Status */}
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-lg">
            <div className="flex items-center gap-sm mb-md">
              <span className="material-symbols-outlined text-primary">info</span>
              <h3 className="font-headline-sm text-headline-sm text-on-surface">Status</h3>
            </div>
            <span className={`inline-block px-md py-xs rounded-lg text-label-md font-bold ${status.bg} ${status.text}`}>
              {status.label}
            </span>
          </div>
        </div>

        {/* Organizer Info */}
        {event.organizer && (
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-lg mb-xl">
            <div className="flex items-center gap-sm mb-md">
              <span className="material-symbols-outlined text-primary">person</span>
              <h3 className="font-headline-sm text-headline-sm text-on-surface">Organizer</h3>
            </div>
            <div className="flex items-center gap-md">
              <div className="w-12 h-12 rounded-full bg-primary-fixed flex items-center justify-center">
                <span className="text-primary font-bold text-lg">
                  {event.organizer.full_name?.charAt(0) || 'O'}
                </span>
              </div>
              <div>
                <p className="font-label-md text-on-surface font-bold">{event.organizer.full_name}</p>
                <p className="text-body-sm text-on-surface-variant">{event.organizer.email}</p>
              </div>
            </div>
          </div>
        )}

        {/* Description Full */}
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-xl mb-xl">
          <h3 className="font-headline-sm text-headline-sm text-on-surface mb-md">About this event</h3>
          <p className="text-body-md text-on-surface-variant whitespace-pre-wrap">{event.description}</p>
        </div>

        {/* Metadata */}
        <div className="text-body-sm text-on-surface-variant text-center">
          <p>Event ID: {event.id} &bull; Created: {new Date(event.created_at).toLocaleDateString()}</p>
        </div>
      </main>
    </div>
  )
}

export default EventDetail
