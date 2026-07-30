import { Link } from 'react-router-dom'

const STATUS_STYLES = {
  approved: { bg: 'bg-green-100', text: 'text-green-700', label: 'Approved' },
  pending: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Pending' },
  rejected: { bg: 'bg-red-100', text: 'text-red-700', label: 'Rejected' },
}

const EventCard = ({ event, featured = false }) => {
  const status = STATUS_STYLES[event.status] || STATUS_STYLES.pending

  const formatDate = (dateStr) => {
    const d = new Date(dateStr + 'T00:00:00')
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const formatTime = (timeStr) => {
    const [h, m] = timeStr.split(':')
    const hr = parseInt(h)
    const ampm = hr >= 12 ? 'PM' : 'AM'
    const hr12 = hr % 12 || 12
    return `${hr12}:${m} ${ampm}`
  }

  if (featured) {
    return (
      <Link
        to={`/events/${event.id}`}
        className="col-span-1 md:col-span-2 xl:col-span-2 group relative overflow-hidden rounded-2xl bg-on-background shadow-xl hover:shadow-2xl transition-all duration-500 border border-outline/20 block"
        aria-label={`Featured event: ${event.title} - ${status.label}`}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary-container via-primary to-inverse-surface opacity-80"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-on-background via-on-background/40 to-transparent"></div>
        <div className="relative h-full flex flex-col justify-end p-xl sm:p-2xl min-h-[280px] sm:min-h-[320px]">
          <div className="flex items-center gap-sm mb-md">
            <span className="px-md py-xs bg-primary text-on-primary text-label-sm font-bold rounded-lg tracking-widest uppercase">
              Featured
            </span>
            <span className={`px-md py-xs text-label-sm rounded-lg ${status.bg} ${status.text} font-bold`}>
              {status.label}
            </span>
          </div>
          <h2 className="font-display-lg text-display-lg text-white mb-md">{event.title}</h2>
          <div className="flex flex-wrap gap-x-xl gap-y-sm text-white/80 font-label-md mb-lg">
            <span className="flex items-center gap-xs">
              <span className="material-symbols-outlined text-[20px]" aria-hidden="true">calendar_today</span>
              <span>{formatDate(event.date)}</span>
            </span>
            <span className="flex items-center gap-xs">
              <span className="material-symbols-outlined text-[20px]" aria-hidden="true">location_on</span>
              <span>{event.location}</span>
            </span>
            <span className="flex items-center gap-xs">
              <span className="material-symbols-outlined text-[20px]" aria-hidden="true">group</span>
              <span>{event.capacity} Capacity</span>
            </span>
            <span className="flex items-center gap-xs">
              <span className="material-symbols-outlined text-[20px]" aria-hidden="true">schedule</span>
              <span>{formatTime(event.time)}</span>
            </span>
          </div>
          <p className="text-white/70 font-body-sm mb-lg line-clamp-2 max-w-2xl">{event.description}</p>
          <div>
            <span className="px-xl sm:px-2xl py-md bg-white text-on-background font-bold rounded-lg hover:bg-primary-fixed transition-colors inline-block">
              View Details
            </span>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link
      to={`/events/${event.id}`}
      className="group bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 block"
      aria-label={`Event: ${event.title} - ${formatDate(event.date)} - ${status.label}`}
    >
      <div className="h-32 sm:h-40 overflow-hidden relative bg-gradient-to-br from-surface-container-high to-surface-container">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="material-symbols-outlined text-5xl text-primary/30" aria-hidden="true">event</span>
        </div>
        <div className="absolute top-md right-md bg-surface-container-highest/90 backdrop-blur-sm px-md py-xs rounded-lg font-label-sm text-primary">
          {event.status}
        </div>
      </div>
      <div className="p-lg">
        <h3 className="font-headline-sm text-headline-sm text-on-surface mb-sm group-hover:text-primary transition-colors line-clamp-1">
          {event.title}
        </h3>
        <p className="text-body-sm text-on-surface-variant mb-lg line-clamp-2">{event.description}</p>
        <div className="space-y-sm mb-lg">
          <div className="flex items-center gap-sm text-on-surface-variant text-label-md">
            <span className="material-symbols-outlined text-[18px]" aria-hidden="true">schedule</span>
            <span>{formatDate(event.date)} &bull; {formatTime(event.time)}</span>
          </div>
          <div className="flex items-center gap-sm text-on-surface-variant text-label-md">
            <span className="material-symbols-outlined text-[18px]" aria-hidden="true">location_on</span>
            <span>{event.location}</span>
          </div>
          <div className="flex items-center gap-sm text-on-surface-variant text-label-md">
            <span className="material-symbols-outlined text-[18px]" aria-hidden="true">group</span>
            <span>{event.capacity} Capacity</span>
          </div>
        </div>
        <div className="flex items-center justify-between pt-md border-t border-outline-variant">
          <span className={`px-sm py-xs rounded-lg text-label-sm font-bold ${status.bg} ${status.text}`}>
            {status.label}
          </span>
          <span className="px-lg py-sm bg-surface-container text-primary font-bold rounded-lg group-hover:bg-primary group-hover:text-on-primary transition-all text-label-md">
            Details
          </span>
        </div>
      </div>
    </Link>
  )
}

export default EventCard
