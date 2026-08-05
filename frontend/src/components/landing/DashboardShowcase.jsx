import Reveal from './Reveal'
import SectionHeading from './SectionHeading'

const EVENT_ROWS = [
  {
    title: 'Product Launch Mixer',
    date: 'Fri, Sep 25, 2026',
    time: '6:00 PM',
    location: 'Downtown Hall',
    capacity: 120,
    status: 'approved',
  },
  {
    title: 'Design Systems Workshop',
    date: 'Mon, Oct 12, 2026',
    time: '10:00 AM',
    location: 'Online',
    capacity: 80,
    status: 'pending',
  },
  {
    title: 'Annual Tech Summit',
    date: 'Thu, Nov 5, 2026',
    time: '9:30 AM',
    location: 'Convention Center',
    capacity: 300,
    status: 'approved',
  },
]

const STATUS_STYLES = {
  approved: { bg: 'bg-green-100', text: 'text-green-700', label: 'Approved' },
  pending: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Pending' },
}

const MetaRow = ({ icon, children }) => (
  <span className="flex items-center gap-1 text-[13px] text-on-surface-variant">
    <span className="material-symbols-outlined text-[15px]" aria-hidden="true">{icon}</span>
    {children}
  </span>
)

const DashboardShowcase = () => {
  return (
    <section className="landing-section bg-surface-bright">
      <div className="max-w-[1440px] mx-auto px-lg sm:px-xl">
        <SectionHeading
          eyebrow="Dashboard Showcase"
          title="A real workspace, not a mockup"
          description="This is the actual EventPro dashboard layout — stats, filters, and event rows rendered from the real design system."
        />

        <Reveal>
          <div className="showcase-window">
            <div className="showcase-window__bar">
              <span className="showcase-window__dot bg-error/70" />
              <span className="showcase-window__dot bg-amber-500/80" />
              <span className="showcase-window__dot bg-green-500/80" />
              <div className="ml-4 flex-1 max-w-xs px-lg py-sm rounded-lg bg-surface-container text-body-sm text-on-surface-variant flex items-center gap-sm">
                <span className="material-symbols-outlined text-[16px]" aria-hidden="true">lock</span>
                app.eventpro.dev/organizer/dashboard
              </div>
            </div>

            <div className="bg-surface-bright p-lg sm:p-xl">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-md mb-lg">
                <div>
                  <p className="font-headline-lg text-headline-lg text-on-surface mb-xs">
                    Welcome, Aaryan
                  </p>
                  <p className="text-body-md text-on-surface-variant">
                    You are logged in as{' '}
                    <strong className="text-primary">Organizer</strong>.
                  </p>
                </div>
                <div className="flex items-center justify-center gap-xs px-lg py-sm rounded-lg bg-primary text-on-primary font-label-md shadow-md w-full sm:w-auto">
                  <span className="material-symbols-outlined text-[20px]" aria-hidden="true">add</span>
                  Create Event
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-md mb-lg">
                {[
                  { value: '12', label: 'Total Events', color: 'text-primary' },
                  { value: '9', label: 'Approved', color: 'text-green-600' },
                  { value: '2', label: 'Pending', color: 'text-amber-600' },
                  { value: '1', label: 'Rejected', color: 'text-red-600' },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="bg-surface-container-lowest rounded-xl border border-outline-variant p-lg"
                  >
                    <p className={`font-display-lg text-display-lg font-bold ${stat.color} mb-1`}>
                      {stat.value}
                    </p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-sm mb-lg" role="group" aria-label="Status filters">
                {['All Events', 'Pending', 'Approved', 'Rejected'].map((filter, i) => (
                  <span
                    key={filter}
                    className={
                      i === 0
                        ? 'px-lg py-sm bg-primary text-on-primary rounded-full font-label-md shadow-md'
                        : 'px-lg py-sm bg-surface-container-lowest text-on-surface-variant border border-outline-variant rounded-full font-label-md'
                    }
                  >
                    {filter}
                  </span>
                ))}
              </div>

              <div className="space-y-md">
                {EVENT_ROWS.map((event) => {
                  const status = STATUS_STYLES[event.status]
                  return (
                    <div
                      key={event.title}
                      className="bg-surface-container-lowest rounded-xl border border-outline-variant p-lg"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-md">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-sm mb-sm flex-wrap">
                            <h3 className="font-headline-sm text-headline-sm text-on-surface truncate">
                              {event.title}
                            </h3>
                            <span className={`px-sm py-xs rounded-lg text-label-sm font-bold ${status.bg} ${status.text}`}>
                              {status.label}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-x-lg gap-y-sm">
                            <MetaRow icon="calendar_today">{event.date}</MetaRow>
                            <MetaRow icon="schedule">{event.time}</MetaRow>
                            <MetaRow icon="location_on">{event.location}</MetaRow>
                            <MetaRow icon="group">{event.capacity} capacity</MetaRow>
                          </div>
                        </div>
                        <div className="flex items-center gap-sm shrink-0">
                          <span className="px-md py-sm border border-outline-variant rounded-lg font-label-md text-label-md text-on-surface flex items-center gap-xs">
                            <span className="material-symbols-outlined text-[18px]" aria-hidden="true">group</span>
                            <span className="hidden sm:inline">Participants</span>
                          </span>
                          <span className="px-md py-sm border border-primary/30 text-primary rounded-lg font-label-md text-label-md flex items-center gap-xs">
                            <span className="material-symbols-outlined text-[18px]" aria-hidden="true">edit</span>
                            <span className="hidden sm:inline">Edit</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export default DashboardShowcase
