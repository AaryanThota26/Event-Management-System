import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import HeroPreview from './HeroPreview'
import { AUTH_ROUTES, EXTERNAL_LINKS } from './links'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: 0.1 * i, ease: [0.22, 1, 0.36, 1] },
  }),
}

const Hero = () => {
  return (
    <section className="glass-background relative overflow-hidden pt-28 pb-16 md:pt-36 md:pb-24">
      <div className="max-w-[1440px] mx-auto px-lg sm:px-xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          <div>
            <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0}>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary font-label-md font-semibold text-sm mb-6">
                <span className="landing-pulse w-2 h-2 rounded-full bg-primary" />
                Role-based event management
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={1}
              className="font-display-lg text-4xl md:text-5xl lg:text-6xl font-bold text-on-surface tracking-tight leading-[1.1] mb-6"
            >
              Plan, approve, and register for events —{' '}
              <span className="text-primary">beautifully.</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={2}
              className="font-body-lg text-body-lg text-on-surface-variant max-w-xl mb-8"
            >
              One platform where organizers publish, admins curate, and attendees
              join in a single click. No spreadsheets, no email threads, no chaos.
            </motion.p>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={3}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-sm mb-8"
            >
              <Link
                to={AUTH_ROUTES.signup}
                className="flex-1 sm:flex-none px-xl py-md rounded-lg bg-primary text-on-primary font-label-md text-center shadow-md hover:bg-primary-container transition-colors"
              >
                Get Started
              </Link>
              <a
                href={EXTERNAL_LINKS.liveDemo}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-none px-xl py-md rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface font-label-md text-center hover:bg-surface-container transition-colors inline-flex items-center justify-center gap-xs"
              >
                Live Demo
                <span className="material-symbols-outlined text-[18px]" aria-hidden="true">open_in_new</span>
              </a>
              <a
                href={EXTERNAL_LINKS.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-none px-xl py-md rounded-lg text-on-surface-variant font-label-md text-center hover:text-on-surface transition-colors inline-flex items-center justify-center gap-xs"
              >
                <svg viewBox="0 0 16 16" className="w-4 h-4" fill="currentColor" aria-hidden="true">
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
                </svg>
                GitHub
              </a>
            </motion.div>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={4}
              className="flex flex-wrap items-center gap-lg"
            >
              <div className="flex items-center gap-sm">
                <div className="flex -space-x-2">
                  {['AR', 'MK', 'SL'].map((initials) => (
                    <span
                      key={initials}
                      className="w-8 h-8 rounded-full bg-primary-container text-on-primary flex items-center justify-center text-label-sm font-bold border-2 border-surface-bright"
                    >
                      {initials}
                    </span>
                  ))}
                </div>
                <span className="text-body-sm text-on-surface-variant">
                  3 roles, one workflow
                </span>
              </div>
              <div className="flex items-center gap-xs text-body-sm text-on-surface-variant">
                <span className="material-symbols-outlined text-[18px] text-green-600" aria-hidden="true">verified</span>
                Free forever for teams
              </div>
            </motion.div>
          </div>

          <HeroPreview />
        </div>
      </div>
    </section>
  )
}

export default Hero
