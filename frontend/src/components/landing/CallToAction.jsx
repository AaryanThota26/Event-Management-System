import { Link } from 'react-router-dom'
import Reveal from './Reveal'
import { AUTH_ROUTES, EXTERNAL_LINKS } from './links'

const CallToAction = () => {
  return (
    <section className="landing-section bg-surface-bright">
      <div className="max-w-[1440px] mx-auto px-lg sm:px-xl">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-on-background text-white px-xl py-16 md:py-20 text-center">
            <div
              className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-primary-container/40 blur-3xl"
              aria-hidden="true"
            />
            <div
              className="absolute -bottom-40 -left-24 w-96 h-96 rounded-full bg-primary-fixed/20 blur-3xl"
              aria-hidden="true"
            />
            <div className="relative">
              <h2 className="font-display-lg text-3xl md:text-5xl font-bold text-white tracking-tight mb-4">
                Ready to Manage Events?
              </h2>
              <p className="font-body-lg text-body-lg text-inverse-on-surface/80 max-w-xl mx-auto mb-8">
                Create your free account, publish your first event, and let the
                right people find it.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-sm">
                <Link
                  to={AUTH_ROUTES.signup}
                  className="w-full sm:w-auto px-xl py-md rounded-lg bg-primary text-on-primary font-label-md shadow-md hover:bg-primary-container transition-colors"
                >
                  Get Started Free
                </Link>
                <a
                  href={EXTERNAL_LINKS.apiDocs}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-xl py-md rounded-lg border border-white/20 text-white font-label-md hover:bg-white/10 transition-colors inline-flex items-center justify-center gap-xs"
                >
                  View API Docs
                  <span className="material-symbols-outlined text-[18px]" aria-hidden="true">open_in_new</span>
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export default CallToAction
