import { useState, useEffect } from 'react'
import api from '../services/api'
import EventCard from '../components/EventCard'
import SkeletonLoader from '../components/SkeletonLoader'

const Events = () => {
  const [events, setEvents] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [locationFilter, setLocationFilter] = useState('')
  const [showMobileFilters, setShowMobileFilters] = useState(false)


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
    const matchesLocation =
      !locationFilter ||
      e.location.toLowerCase().includes(locationFilter.toLowerCase())
    const matchesDate =
      (!fromDate || e.date >= fromDate) &&
      (!toDate || e.date <= toDate)
    return matchesSearch && matchesStatus && matchesLocation && matchesDate
  })

  const filters = [
    { key: 'all', label: 'All Events' },
    { key: 'approved', label: 'Approved' },
    { key: 'pending', label: 'Pending' },
    { key: 'rejected', label: 'Rejected' },
  ]

  const hasActiveFilters = fromDate || toDate || locationFilter
  const activeFilterCount = [fromDate, toDate, locationFilter].filter(Boolean).length

  return (
    <>
      {/* Hero */}
      <div className="mb-xl">
        <h1 className="font-headline-lg text-headline-lg text-on-surface mb-xs">Browse Events</h1>
        <p className="text-body-md text-on-surface-variant">
          Discover and manage professional workshops, tech conferences, and cultural events.
        </p>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-md mb-xl">
        <div className="flex flex-wrap items-center gap-sm" role="group" aria-label="Status filters">
          {filters.map((f) => (
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
        <div className="flex items-center gap-sm w-full md:w-auto">
          {/* Mobile filter toggle */}
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="md:hidden px-md py-sm border border-outline-variant rounded-lg font-label-md text-label-md text-on-surface-variant hover:bg-surface-container transition-colors flex items-center gap-sm"
            aria-label="Toggle filters"
            aria-expanded={showMobileFilters}
          >
            <span className="material-symbols-outlined text-[18px]" aria-hidden="true">filter_list</span>
            Filters
            {activeFilterCount > 0 && (
              <span className="bg-primary text-on-primary text-label-sm rounded-full w-5 h-5 flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
          {/* Search */}
          <div className="relative flex-1 md:flex-none">
            <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-on-surface-variant opacity-60 pointer-events-none" aria-hidden="true">search</span>
            <input
              className="w-full md:w-[320px] pl-2xl pr-md py-sm bg-white border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary text-body-sm transition-all shadow-sm"
              placeholder="Search by name or keyword..."
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search events"
            />
          </div>
        </div>
      </div>

      {/* Date, Location & Clear Filters — visible on desktop, collapsible on mobile */}
      <div className={`${showMobileFilters ? 'flex' : 'hidden'} md:flex flex-wrap items-center gap-md mb-xl`} role="group" aria-label="Additional filters">
        {/* Location Filter */}
        <div className="relative w-full sm:w-auto">
          <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-on-surface-variant opacity-60 text-[18px] pointer-events-none" aria-hidden="true">location_on</span>
          <input
            className="w-full sm:w-[200px] pl-2xl pr-md py-sm bg-white border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary text-body-sm transition-all shadow-sm"
            placeholder="Filter by location..."
            type="text"
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            aria-label="Filter by location"
          />
        </div>

        {/* Date From */}
        <div className="flex items-center gap-sm w-full sm:w-auto">
          <label htmlFor="filter-from-date" className="font-label-sm text-label-sm text-on-surface-variant whitespace-nowrap sr-only sm:not-sr-only">
            From
          </label>
          <input
            id="filter-from-date"
            className="w-full sm:w-[160px] px-md py-sm bg-white border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary text-body-sm transition-all shadow-sm"
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            aria-label="Filter events from date"
          />
        </div>

        {/* Date To */}
        <div className="flex items-center gap-sm w-full sm:w-auto">
          <label htmlFor="filter-to-date" className="font-label-sm text-label-sm text-on-surface-variant whitespace-nowrap sr-only sm:not-sr-only">
            To
          </label>
          <input
            id="filter-to-date"
            className="w-full sm:w-[160px] px-md py-sm bg-white border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary text-body-sm transition-all shadow-sm"
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            aria-label="Filter events to date"
          />
        </div>

        {/* Active filter count & clear */}
        {hasActiveFilters && (
          <button
            onClick={() => {
              setFromDate('')
              setToDate('')
              setLocationFilter('')
            }}
            className="px-md py-sm border border-outline-variant rounded-lg font-label-md text-label-md text-on-surface-variant hover:bg-surface-container transition-colors flex items-center gap-xs"
          >
            <span className="material-symbols-outlined text-[18px]" aria-hidden="true">close</span>
            Clear Filters
          </button>
        )}
      </div>

      {/* Content Area — stable min-height prevents layout shift */}
      <div className="min-h-[400px]">
        {/* Loading State with Skeleton */}
        {loading && <SkeletonLoader type="card" count={6} />}

        {/* Error State */}
        {!loading && error && (
          <div className="flex flex-col items-center justify-center min-h-[400px]" role="alert">
            <span className="material-symbols-outlined text-4xl text-error mb-md" aria-hidden="true">error</span>
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
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <span className="material-symbols-outlined text-6xl text-outline-variant mb-md" aria-hidden="true">
              {events.length === 0 ? 'event_busy' : 'search_off'}
            </span>
            <p className="font-headline-sm text-headline-sm text-on-surface mb-xs">
              {events.length === 0 ? 'No events yet' : 'No matching events'}
            </p>
            <p className="text-body-sm text-on-surface-variant text-center max-w-md">
              {events.length === 0
                ? 'No events have been created yet. Check back later or contact an organizer.'
                : 'Try adjusting your search keywords, changing the date range, or clearing the filters.'}
            </p>
            {events.length > 0 && hasActiveFilters && (
              <button
                onClick={() => {
                  setFromDate('')
                  setToDate('')
                  setLocationFilter('')
                  setSearch('')
                }}
                className="mt-lg px-xl py-md bg-primary text-on-primary rounded-lg font-label-md hover:bg-primary-container transition-colors"
              >
                Clear All Filters
              </button>
            )}
          </div>
        )}

        {/* Event Grid */}
        {!loading && !error && filtered.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-lg">
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
              Showing {filtered.length} of {total} event{total !== 1 ? 's' : ''}
            </p>
          </div>
        </>
      )}
      </div>
    </>
  )
}

export default Events
