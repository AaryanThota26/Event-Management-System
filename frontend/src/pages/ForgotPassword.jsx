import { useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import EventProLogo from '../components/EventProLogo'
import FormInput from '../components/FormInput'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [submitState, setSubmitState] = useState('idle')
  const [fieldErrors, setFieldErrors] = useState({})

  const validate = () => {
    const errs = {}
    if (!email.trim()) errs.email = 'Email is required'
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
      await api.post('/api/auth/forgot-password', { email: email.trim() })
      // The API always returns the same response whether or not the email
      // exists (anti-enumeration), so we always show the same success view.
      setSubmitState('success')
    } catch (err) {
      setSubmitState('idle')
      setError(
        err.response?.data?.detail ||
          'Unable to send the reset link. Please try again.'
      )
    }
  }

  const getButtonContent = () => {
    if (submitState === 'loading') {
      return (
        <>
          <span className="material-symbols-outlined animate-spin" aria-hidden="true">sync</span>
          <span>Sending...</span>
        </>
      )
    }
    return (
      <>
        <span>Send reset link</span>
        <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform" aria-hidden="true">
          arrow_forward
        </span>
      </>
    )
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-md sm:p-lg glass-background">
      {/* Skip to content link */}
      <a href="#forgot-password-form" className="skip-to-main">
        Skip to forgot password form
      </a>

      {/* Header Logo */}
      <header className="absolute top-0 left-0 w-full p-lg flex justify-center lg:justify-start">
        <Link to="/" aria-label="EventPro home">
          <EventProLogo />
        </Link>
      </header>

      <main className="w-full max-w-[480px] z-10" id="main-content">
        {/* Forgot Password Card */}
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm p-xl sm:p-2xl">
          {submitState === 'success' ? (
            /* Success View — same message shown for any email */
            <div className="text-center py-lg">
              <span
                className="material-symbols-outlined text-5xl text-primary mb-md"
                aria-hidden="true"
              >
                mark_email_read
              </span>
              <h2 className="font-headline-md text-headline-md text-on-surface mb-sm">
                Check your email
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant mb-xl">
                If an account exists for {email.trim()}, a password reset link has been sent.
              </p>
              <Link
                className="text-primary font-label-md text-label-md hover:underline"
                to="/login"
              >
                Back to sign in
              </Link>
            </div>
          ) : (
            <>
              {/* Heading */}
              <div className="mb-xl text-center">
                <h1 className="font-headline-lg text-headline-lg text-on-surface mb-xs">
                  Forgot password?
                </h1>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Enter your email and we&apos;ll send you a link to reset your password.
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

              {/* Forgot Password Form */}
              <form
                id="forgot-password-form"
                className="space-y-lg"
                onSubmit={handleSubmit}
                noValidate
                aria-label="Forgot password form"
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

                {/* Submit Button */}
                <button
                  className={`w-full py-md font-label-md text-label-md rounded-lg transition-all active:scale-95 shadow-sm flex items-center justify-center gap-sm group ${
                    submitState === 'loading'
                      ? 'bg-primary text-on-primary opacity-80 cursor-wait'
                      : 'bg-primary text-on-primary hover:bg-primary-container hover:shadow-md'
                  }`}
                  type="submit"
                  disabled={submitState === 'loading'}
                  aria-busy={submitState === 'loading'}
                >
                  {getButtonContent()}
                </button>
              </form>

              {/* Back to Login Link */}
              <div className="mt-xl text-center">
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Remembered your password?{' '}
                  <Link
                    className="text-primary font-label-md text-label-md hover:underline"
                    to="/login"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </>
          )}
        </div>

        {/* Footer Links */}
        <footer className="mt-xl flex justify-center gap-xl text-label-sm text-label-sm text-on-surface-variant">
          <Link className="hover:text-primary transition-colors" to="/privacy">
            Privacy Policy
          </Link>
          <Link className="hover:text-primary transition-colors" to="/terms">
            Terms of Service
          </Link>
          <Link className="hover:text-primary transition-colors" to="/help">
            Help Center
          </Link>
        </footer>
      </main>

      {/* Decorative Background Element */}
      <div className="fixed bottom-0 right-0 w-1/3 h-1/3 -z-10 opacity-20 pointer-events-none" aria-hidden="true">
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary rounded-full blur-[120px]"></div>
      </div>
    </div>
  )
}

export default ForgotPassword
