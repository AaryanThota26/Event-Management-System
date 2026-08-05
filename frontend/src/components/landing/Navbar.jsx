import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import EventProLogo from '../EventProLogo'
import { NAV_LINKS, AUTH_ROUTES } from './links'

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.header
      initial={{ y: -64, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-surface-bright/85 backdrop-blur-xl shadow-sm border-b border-outline-variant/60'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-lg sm:px-xl">
        <div className="flex items-center justify-between h-16">
          <Link to="/" aria-label="EventPro home">
            <EventProLogo />
          </Link>

          <nav
            className="hidden md:flex items-center gap-lg"
            aria-label="Main navigation"
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="font-label-md text-on-surface-variant hover:text-primary transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-md">
            <Link
              to={AUTH_ROUTES.login}
              className="px-md py-sm rounded-lg font-label-md text-on-surface hover:bg-surface-container transition-colors"
            >
              Log in
            </Link>
            <Link
              to={AUTH_ROUTES.signup}
              className="px-lg py-sm rounded-lg bg-primary text-on-primary font-label-md shadow-md hover:bg-primary-container transition-colors"
            >
              Get Started
            </Link>
          </div>

          <button
            onClick={() => setMobileOpen((prev) => !prev)}
            className="md:hidden material-symbols-outlined p-sm rounded-full hover:bg-surface-container transition-colors text-on-surface-variant"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? 'close' : 'menu'}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden overflow-hidden bg-surface-bright/95 backdrop-blur-xl border-t border-outline-variant/60"
            aria-label="Mobile navigation"
          >
            <div className="px-lg py-md flex flex-col gap-sm">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="px-md py-sm rounded-lg font-label-md text-on-surface-variant hover:bg-surface-container hover:text-primary transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <div className="border-t border-outline-variant my-sm" />
              <Link
                to={AUTH_ROUTES.login}
                onClick={() => setMobileOpen(false)}
                className="px-md py-sm rounded-lg font-label-md text-on-surface hover:bg-surface-container transition-colors"
              >
                Log in
              </Link>
              <Link
                to={AUTH_ROUTES.signup}
                onClick={() => setMobileOpen(false)}
                className="px-md py-sm rounded-lg bg-primary text-on-primary font-label-md text-center shadow-md hover:bg-primary-container transition-colors"
              >
                Get Started
              </Link>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  )
}

export default Navbar
