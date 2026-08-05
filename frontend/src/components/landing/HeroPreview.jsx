import { motion } from 'framer-motion'

const EventDraftCard = () => (
  <div className="hero-preview__card bg-white rounded-2xl border border-outline-variant shadow-xl p-lg w-[280px] sm:w-[300px]">
    <div className="flex items-center justify-between mb-sm">
      <span className="text-label-sm font-semibold uppercase tracking-wider text-on-surface-variant">
        Draft
      </span>
      <span className="px-sm py-xs rounded-lg bg-amber-100 text-amber-700 text-label-sm font-bold">
        Pending
      </span>
    </div>
    <p className="font-headline-sm text-headline-sm text-on-surface mb-sm">
      Product Launch Mixer
    </p>
    <div className="flex items-center gap-xs text-body-sm text-on-surface-variant mb-sm">
      <span className="material-symbols-outlined text-[16px]" aria-hidden="true">location_on</span>
      Downtown Hall
    </div>
    <div className="flex items-center gap-sm text-body-sm text-on-surface-variant">
      <span className="material-symbols-outlined text-[16px]" aria-hidden="true">group</span>
      120 seats
    </div>
  </div>
)

const AdminReviewCard = () => (
  <div className="hero-preview__card hero-preview__card--delay-1 bg-white rounded-2xl border border-outline-variant shadow-xl p-lg w-[260px] sm:w-[280px]">
    <div className="flex items-center gap-sm mb-md">
      <div className="bg-primary-container p-xs rounded-lg">
        <span className="material-symbols-outlined text-on-primary text-[20px]" aria-hidden="true">verified_user</span>
      </div>
      <div>
        <p className="font-label-md text-label-md font-semibold text-on-surface">Admin Review</p>
        <p className="text-body-sm text-on-surface-variant">Tech Summit 2026</p>
      </div>
    </div>
    <div className="flex items-center gap-sm">
      <span className="flex-1 flex items-center justify-center gap-xs px-md py-sm rounded-lg bg-green-600 text-white font-label-md shadow-sm">
        <span className="material-symbols-outlined text-[18px]" aria-hidden="true">check</span>
        Approve
      </span>
      <span className="flex-1 flex items-center justify-center gap-xs px-md py-sm rounded-lg border border-error/30 text-error font-label-md">
        <span className="material-symbols-outlined text-[18px]" aria-hidden="true">close</span>
        Reject
      </span>
    </div>
  </div>
)

const OneClickRegisterCard = () => (
  <div className="hero-preview__card hero-preview__card--delay-2 bg-white rounded-2xl border border-outline-variant shadow-xl p-lg w-[240px] sm:w-[260px]">
    <div className="flex items-center gap-sm mb-sm">
      <div className="bg-green-100 rounded-full p-sm">
        <span className="material-symbols-outlined text-green-600 text-[18px]" aria-hidden="true">event_available</span>
      </div>
      <p className="font-label-md text-label-md font-semibold text-on-surface">
        Registered!
      </p>
    </div>
    <p className="text-body-sm text-on-surface-variant mb-sm">
      Design Systems Workshop
    </p>
    <div className="flex items-center justify-center gap-xs px-md py-sm rounded-lg bg-primary text-on-primary font-label-md shadow-md">
      <span className="material-symbols-outlined text-[18px]" aria-hidden="true">arrow_forward</span>
      View ticket
    </div>
  </div>
)

const HeroPreview = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 24 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex items-center justify-center h-[520px]"
      aria-hidden="true"
    >
      {/* Soft glow behind the cards */}
      <div className="absolute w-[420px] h-[420px] rounded-full bg-primary/10 blur-3xl" />

      <div className="relative flex flex-col items-center gap-lg sm:gap-xl">
        <div className="sm:-translate-x-16">
          <EventDraftCard />
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-lg sm:gap-xl sm:-translate-y-10">
          <AdminReviewCard />
          <OneClickRegisterCard />
        </div>
      </div>
    </motion.div>
  )
}

export default HeroPreview
