import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../services/api'
import EventProLogo from '../components/EventProLogo'
import FormInput from '../components/FormInput'

const Signup = () => {
  const navigate = useNavigate()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('user')
  const [error, setError] = useState('')
  const [submitState, setSubmitState] = useState('idle')
  const [fieldErrors, setFieldErrors] = useState({})

  const validate = () => {
    const errs = {}
    if (!fullName.trim()) {
      errs.fullName = 'Full name is required'
    } else if (fullName.trim().length < 2) {
      errs.fullName = 'Full name must be at least 2 characters'
    }
    if (!email.trim()) errs.email = 'Email is required'
    if (!password) {
      errs.password = 'Password is required'
    } else if (password.length < 6) {
      errs.password = 'Password must be at least 6 characters'
    }
    setFieldErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setFieldErrors({})

    if (!validate()) return

    setSubmitState('loading')

    try {
      await api.post('/api/auth/signup', {
        full_name: fullName.trim(),
        email: email.trim(),
        password,
        role,
      })
      setSubmitState('success')
      setTimeout(() => navigate('/login'), 1200)
    } catch (err) {
      setSubmitState('idle')
      setError(
        err.response?.data?.detail || 'Signup failed. Please try again.'
      )
    }
  }

  const getButtonContent = () => {
    if (submitState === 'loading') {
      return (
        <>
          <span className="material-symbols-outlined animate-spin" aria-hidden="true">sync</span>
          <span>Creating account...</span>
        </>
      )
    }
    if (submitState === 'success') {
      return (
        <>
          <span className="material-symbols-outlined" aria-hidden="true">check_circle</span>
          <span>Account created!</span>
        </>
      )
    }
    return (
      <>
        <span>Create account</span>
        <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform" aria-hidden="true">
          arrow_forward
        </span>
      </>
    )
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-md sm:p-lg glass-background">
      {/* Skip to content link */}
      <a href="#signup-form" className="skip-to-main">
        Skip to signup form
      </a>

      {/* Header Logo */}
      <header className="absolute top-0 left-0 w-full p-lg flex justify-center lg:justify-start">
        <EventProLogo />
      </header>

      <main className="w-full max-w-[480px] z-10" id="main-content">
        {/* Signup Card */}
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm p-xl sm:p-2xl">
          {/* Heading */}
          <div className="mb-xl text-center">
            <h1 className="font-headline-lg text-headline-lg text-on-surface mb-xs">
              Create your account
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Start managing your events with EventPro.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div
              className="mb-lg px-md py-sm rounded-lg bg-error-container text-on-error-container font-body-sm text-body-sm flex items-center gap-sm"
              role="alert"
            >
              <span className="material-symbols-outlined text-[18px]" aria-hidden="true">error</span>
              {error}
            </div>
          )}

          {/* Signup Form */}
          <form
            id="signup-form"
            className="space-y-lg"
            onSubmit={handleSubmit}
            noValidate
            aria-label="Signup form"
          >
            <FormInput
              id="fullName"
              label="Full Name"
              type="text"
              icon="person"
              placeholder="John Doe"
              required
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value)
                if (fieldErrors.fullName) setFieldErrors((prev) => ({ ...prev, fullName: '' }))
              }}
              error={fieldErrors.fullName}
              autoComplete="name"
            />

            <FormInput
              id="email"
              label="Email Address"
              type="email"
              icon="mail"
              placeholder="name@company.com"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: '' }))
              }}
              error={fieldErrors.email}
              autoComplete="email"
            />

            <FormInput
              id="password"
              label="Password"
              type="password"
              icon="lock"
              placeholder="Min. 6 characters"
              required
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                if (fieldErrors.password) setFieldErrors((prev) => ({ ...prev, password: '' }))
              }}
              error={fieldErrors.password}
              autoComplete="new-password"
            />

            {/* Role Select */}
            <div className="space-y-xs">
              <label
                className="font-label-md text-label-md text-on-surface"
                htmlFor="role"
                id="role-label"
              >
                I want to join as
                <span className="text-error ml-xs" aria-hidden="true">*</span>
              </label>
              <div className="relative group">
                <span
                  className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-on-surface-variant transition-colors pointer-events-none"
                  aria-hidden="true"
                >
                  badge
                </span>
                <select
                  className="w-full pl-[48px] pr-md py-md bg-surface-container-lowest border border-outline-variant rounded-lg font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all appearance-none"
                  id="role"
                  aria-labelledby="role-label"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="user">User &mdash; Browse and register for events</option>
                  <option value="organizer">Organizer &mdash; Create and manage events</option>
                </select>
                <span
                  className="material-symbols-outlined absolute right-md top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none"
                  aria-hidden="true"
                >
                  expand_more
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              className={`w-full py-md font-label-md text-label-md rounded-lg transition-all active:scale-95 shadow-sm flex items-center justify-center gap-sm group ${
                submitState === 'success'
                  ? 'bg-green-600 text-on-primary'
                  : 'bg-primary text-on-primary hover:bg-primary-container hover:shadow-md'
              } ${submitState === 'loading' ? 'opacity-80 cursor-wait' : ''}`}
              type="submit"
              disabled={submitState === 'loading' || submitState === 'success'}
              aria-busy={submitState === 'loading'}
            >
              {getButtonContent()}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-xl text-center">
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Already have an account?{' '}
              <Link
                className="text-primary font-label-md text-label-md hover:underline"
                to="/login"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Footer Links */}
        <footer className="mt-xl flex justify-center gap-xl text-label-sm text-label-sm text-on-surface-variant">
          <a className="hover:text-primary transition-colors" href="#">
            Privacy Policy
          </a>
          <a className="hover:text-primary transition-colors" href="#">
            Terms of Service
          </a>
          <a className="hover:text-primary transition-colors" href="#">
            Help Center
          </a>
        </footer>
      </main>

      {/* Decorative Background Element */}
      <div className="fixed bottom-0 right-0 w-1/3 h-1/3 -z-10 opacity-20 pointer-events-none" aria-hidden="true">
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary rounded-full blur-[120px]"></div>
      </div>
    </div>
  )
}

export default Signup
