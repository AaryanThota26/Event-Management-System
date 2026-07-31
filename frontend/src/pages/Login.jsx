import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import EventProLogo from '../components/EventProLogo'
import FormInput from '../components/FormInput'

const ROLE_ROUTES = {
  admin: '/admin/dashboard',
  organizer: '/organizer/dashboard',
  user: '/user/dashboard',
}

const Login = () => {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitState, setSubmitState] = useState('idle')
  const [fieldErrors, setFieldErrors] = useState({})

  const validate = () => {
    const errs = {}
    if (!email.trim()) errs.email = 'Email is required'
    if (!password) errs.password = 'Password is required'
    setFieldErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setFieldErrors({})

    if (!validate()) return

    setSubmitState('loading')

    const result = await login(email, password)

    if (result.success) {
      setSubmitState('success')
      setTimeout(() => {
        const route = ROLE_ROUTES[result.user.role] || '/user/dashboard'
        navigate(route)
      }, 800)
    } else {
      setSubmitState('idle')
      setPassword('')
      setError(result.message)
    }
  }

  const getButtonContent = () => {
    if (submitState === 'loading') {
      return (
        <>
          <span className="material-symbols-outlined animate-spin" aria-hidden="true">sync</span>
          <span>Authenticating...</span>
        </>
      )
    }
    if (submitState === 'success') {
      return (
        <>
          <span className="material-symbols-outlined" aria-hidden="true">check_circle</span>
          <span>Success</span>
        </>
      )
    }
    return (
      <>
        <span>Sign in to Dashboard</span>
        <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform" aria-hidden="true">
          arrow_forward
        </span>
      </>
    )
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-md sm:p-lg glass-background">
      {/* Skip to content link */}
      <a href="#login-form" className="skip-to-main">
        Skip to login form
      </a>

      {/* Header Logo */}
      <header className="absolute top-0 left-0 w-full p-lg flex justify-center lg:justify-start">
        <EventProLogo />
      </header>

      <main className="w-full max-w-[480px] z-10" id="main-content">
        {/* Login Card */}
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm p-xl sm:p-2xl">
          {/* Heading */}
          <div className="mb-xl text-center">
            <h1 className="font-headline-lg text-headline-lg text-on-surface mb-xs">
              Welcome back
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Manage your high-stakes events with confidence.
            </p>
          </div>

          {/* General Error Message */}
          {error && (
            <div
              className="mb-lg px-md py-sm rounded-lg bg-error-container text-on-error-container font-body-sm text-body-sm flex items-center gap-sm"
              role="alert"
            >
              <span className="material-symbols-outlined text-[18px]" aria-hidden="true">error</span>
              {error}
            </div>
          )}

          {/* Login Form */}
          <form
            id="login-form"
            className="space-y-lg"
            onSubmit={handleSubmit}
            noValidate
            aria-label="Login form"
          >
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
              placeholder="••••••••"
              required
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                if (fieldErrors.password) setFieldErrors((prev) => ({ ...prev, password: '' }))
              }}
              error={fieldErrors.password}
              autoComplete="current-password"
              rightElement={
                <Link
                  className="font-label-sm text-label-sm text-primary hover:underline"
                  to="/forgot-password"
                >
                  Forgot password?
                </Link>
              }
            />

            {/* Remember me */}
            <div className="flex items-center gap-sm">
              <input
                className="w-4 h-4 text-primary border-outline-variant rounded focus:ring-primary accent-primary"
                id="remember"
                type="checkbox"
              />
              <label
                className="font-body-sm text-body-sm text-on-surface-variant select-none"
                htmlFor="remember"
              >
                Remember me for 30 days
              </label>
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

          {/* Sign Up Link */}
          <div className="mt-xl text-center">
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Don&apos;t have an account?{' '}
              <Link
                className="text-primary font-label-md text-label-md hover:underline"
                to="/signup"
              >
                Create an account
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

export default Login
