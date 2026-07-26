import { useState, useEffect } from 'react'
import api from '../services/api'
import EventCard from '../components/EventCard'

const Events = () => {
  const [events, setEvents] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true)
      setError('')
      try {
        const { data } = await api.get('/api/events', { params: { limit: 100 } })
        setEvents(data.events)
        setTotal(data.total)
      } catch (err) {
        setError(err.response?.data?.detail || 'Failed to load events.')
      } finally {
        setLoading(false)
      }
    }
    fetchEvents()
  }, [])

  const filtered = events.filter((e) => {
    const matchesSearch =
      !search ||
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.description.toLowerCase().includes(search.toLowerCase()) ||
      e.location.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'all' || e.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const filters = [
    { key: 'all', label: 'All Events' },
    { key: 'approved', label: 'Approved' },
    { key: 'pending', label: 'Pending' },
    { key: 'rejected', label: 'Rejected' },
  ]

  return (
    <div className="min-h-screen bg-surface-bright">
      {/* Top Nav */}
      <header className="sticky top-0 z-50 flex justify-between items-center w-full px-lg py-sm bg-surface border-b border-outline-variant shadow-sm">
        <div className="flex items-center gap-xl">
          <span className="font-headline-md text-headline-md font-bold text-primary">EventPro</span>
          <nav className="hidden md:flex items-center gap-lg">
            <a className="text-on-surface-variant hover:text-primary transition-colors font-label-md" href="/user/dashboard">Dashboard</a>
            <a className="text-primary border-b-2 border-primary pb-1 font-medium font-label-md" href="/events">Events</a>
          </nav>
        </div>
        <div className="flex items-center gap-md">
          <button className="material-symbols-outlined p-sm rounded-full hover:bg-surface-container transition-colors text-on-surface-variant">notifications</button>
          <button className="material-symbols-outlined p-sm rounded-full hover:bg-surface-container transition-colors text-on-surface-variant">help</button>
        </div>
      </header>

      <main className="max-w-[1440px] mx-auto p-xl">
        {/* Hero */}
        <div className="mb-2xl">
          <h1 className="font-display-lg text-display-lg text-on-background mb-sm">Browse Events</h1>
          <p className="text-body-lg text-on-surface-variant max-w-2xl">
            Discover and manage professional workshops, tech conferences, and cultural events.
          </p>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-md mb-xl">
          <div className="flex flex-wrap items-center gap-sm">
            {filters.map((f) => (
              <button
                key={f.key}
                onClick={() => setStatusFilter(f.key)}
                className={
                  statusFilter === f.key
                    ? 'px-lg py-sm bg-primary text-on-primary rounded-full font-label-md shadow-md transition-all'
                    : 'px-lg py-sm bg-surface-container-lowest text-on-surface-variant border border-outline-variant rounded-full font-label-md hover:bg-surface-container-high transition-all'
                }
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className="relative w-full md:w-auto">
            <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-on-surface-variant opacity-60">search</span>
            <input
              className="w-full md:w-[320px] pl-2xl pr-md py-sm bg-white border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary text-body-sm transition-all shadow-sm"
              placeholder="Search by name or keyword..."
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-3xl">
            <span className="material-symbols-outlined animate-spin text-4xl text-primary mb-md">sync</span>
            <p className="text-body-md text-on-surface-variant">Loading events...</p>
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
        {!loading && !error && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-3xl">
            <span className="material-symbols-outlined text-5xl text-outline-variant mb-md">event_busy</span>
            <p className="text-headline-sm text-on-surface mb-xs">No events found</p>
            <p className="text-body-sm text-on-surface-variant">
              {events.length === 0
                ? 'No events have been created yet.'
                : 'Try adjusting your search or filters.'}
            </p>
          </div>
        )}

        {/* Event Grid */}
        {!loading && !error && filtered.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-xl">
              {filtered.map((event, i) => (
                <EventCard
                  key={event.id}
                  event={event}
                  featured={i === 0}
                />
              ))}
            </div>

            {/* Total count */}
            <div className="mt-xl text-center">
              <p className="text-body-sm text-on-surface-variant">
                Showing {filtered.length} of {total} events
              </p>
            </div>
          </>
        )}
      </main>
    </div>
  )
}

export default Events
