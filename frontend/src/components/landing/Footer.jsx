import { Link } from 'react-router-dom'
import EventProLogo from '../EventProLogo'
import { NAV_LINKS, AUTH_ROUTES, EXTERNAL_LINKS } from './links'

const FOOTER_LINKS = [
  { label: 'GitHub', href: EXTERNAL_LINKS.github, external: true },
  { label: 'API Docs', href: EXTERNAL_LINKS.apiDocs, external: true },
  { label: 'Live Demo', href: EXTERNAL_LINKS.liveDemo, external: true },
  { label: 'Contact', href: 'https://github.com/AaryanThota26/Event-Management-System/issues', external: true },
]

const Footer = () => {
  return (
    <footer className="border-t border-outline-variant/60 bg-surface-bright">
      <div className="max-w-[1440px] mx-auto px-lg sm:px-xl py-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-lg">
          <div>
            <Link to="/" aria-label="EventPro home">
              <EventProLogo />
            </Link>
            <p className="text-body-sm text-on-surface-variant mt-sm max-w-xs">
              Plan, approve, and register for events — beautifully.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-sm">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-md py-sm rounded-lg font-label-md text-on-surface-variant hover:text-primary transition-colors"
              >
                {link.label}
              </a>
            ))}
            <Link
              to={AUTH_ROUTES.login}
              className="px-md py-sm rounded-lg font-label-md text-on-surface-variant hover:text-primary transition-colors"
            >
              Log in
            </Link>
            <Link
              to={AUTH_ROUTES.signup}
              className="px-md py-sm rounded-lg font-label-md text-on-surface-variant hover:text-primary transition-colors"
            >
              Sign up
            </Link>
          </div>

          <div className="flex flex-wrap items-center gap-sm">
            {FOOTER_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.external ? '_blank' : undefined}
                rel={link.external ? 'noopener noreferrer' : undefined}
                className="px-md py-sm rounded-lg border border-outline-variant bg-surface-container-lowest font-label-md text-on-surface hover:bg-surface-container hover:border-primary/30 transition-colors inline-flex items-center gap-xs"
              >
                {link.label}
                {link.external && (
                  <span className="material-symbols-outlined text-[16px]" aria-hidden="true">open_in_new</span>
                )}
              </a>
            ))}
          </div>
        </div>

        <div className="mt-xl pt-lg border-t border-outline-variant/60 flex flex-col sm:flex-row items-center justify-between gap-sm">
          <p className="text-body-sm text-on-surface-variant">
            © {new Date().getFullYear()} EventPro. All rights reserved.
          </p>
          <p className="text-body-sm text-on-surface-variant">
            Built with React, FastAPI, and PostgreSQL.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
