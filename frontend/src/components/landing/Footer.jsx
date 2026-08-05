import { Link } from 'react-router-dom'
import EventProLogo from '../EventProLogo'
import SectionLink from './SectionLink'
import {
  NAV_LINKS,
  AUTH_ROUTES,
  APP_ROUTES,
  EXTERNAL_LINKS,
} from './links'

const ColumnHeading = ({ children }) => (
  <h3 className="text-label-sm font-semibold uppercase tracking-wider text-on-surface-variant mb-md">
    {children}
  </h3>
)

const FooterLink = ({ to, href, external, children }) => {
  const baseClasses =
    'font-label-md text-on-surface-variant hover:text-primary transition-colors'
  if (to) {
    return (
      <Link to={to} className={baseClasses}>
        {children}
      </Link>
    )
  }
  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      className={baseClasses}
    >
      {children}
    </a>
  )
}

const RESOURCE_LINKS = [
  { label: 'GitHub', href: EXTERNAL_LINKS.github, external: true },
  { label: 'API Docs', href: EXTERNAL_LINKS.apiDocs, external: true },
  { label: 'Contact', href: EXTERNAL_LINKS.issues, external: true },
  { label: 'Help Center', to: APP_ROUTES.help },
  { label: 'Privacy Policy', to: APP_ROUTES.privacy },
  { label: 'Terms of Service', to: APP_ROUTES.terms },
]

const ACCOUNT_LINKS = [
  { label: 'Log In', to: AUTH_ROUTES.login },
  { label: 'Sign Up', to: AUTH_ROUTES.signup },
]

const Footer = () => {
  return (
    <footer className="border-t border-outline-variant/60 bg-surface-bright">
      <div className="max-w-[1440px] mx-auto px-lg sm:px-xl py-xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-xl">
          <div>
            <Link to="/" aria-label="EventPro home">
              <EventProLogo />
            </Link>
            <p className="text-body-sm text-on-surface-variant mt-md max-w-xs">
              Plan, approve, and register for events — beautifully.
            </p>
          </div>

          <nav aria-label="Product">
            <ColumnHeading>Product</ColumnHeading>
            <ul className="space-y-sm">
              {NAV_LINKS.map((link) => (
                <li key={link.id}>
                  <SectionLink
                    id={link.id}
                    label={link.label}
                    className="font-label-md text-on-surface-variant hover:text-primary transition-colors"
                  />
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Account">
            <ColumnHeading>Account</ColumnHeading>
            <ul className="space-y-sm">
              {ACCOUNT_LINKS.map((link) => (
                <li key={link.label}>
                  <FooterLink to={link.to}>{link.label}</FooterLink>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Resources">
            <ColumnHeading>Resources</ColumnHeading>
            <ul className="space-y-sm">
              {RESOURCE_LINKS.map((link) => (
                <li key={link.label}>
                  <FooterLink
                    to={link.to}
                    href={link.href}
                    external={link.external}
                  >
                    {link.label}
                  </FooterLink>
                </li>
              ))}
            </ul>
          </nav>
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
