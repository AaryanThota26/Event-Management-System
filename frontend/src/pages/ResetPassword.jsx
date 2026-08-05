import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import api from '../services/api'
import EventProLogo from '../components/EventProLogo'
import FormInput from '../components/FormInput'

const ResetPassword = () => {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') || ''

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [submitState, setSubmitState] = useState('idle')
  const [fieldErrors, setFieldErrors] = useState({})

  const validate = () => {
    const errs = {}
    if (!newPassword) {
      errs.newPassword = 'New password is required'
    } else if (newPassword.length < 6) {
      errs.newPassword = 'Password must be at least 6 characters'
    }
    if (!confirmPassword) {
      errs.confirmPassword = 'Please confirm your new password'
    } else if (confirmPassword !== newPassword) {
      errs.confirmPassword = 'Passwords do not match'
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
      await api.post('/api/auth/reset-password', {
        token,
        new_password: newPassword,
      })
      setSubmitState('success')
    } catch (err) {
      setSubmitState('idle')
      setError(
        err.response?.data?.detail ||
          'This reset link is invalid or has expired. Please request a new one.'
      )
    }
  }

  const getButtonContent = () => {
    if (submitState === 'loading') {
      return (
        <>
          <span className="material-symbols-outlined animate-spin" aria-hidden="true">sync</span>
          <span>Resetting...</span>
        </>
      )
    }
    return (
      <>
        <span>Reset password</span>
        <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform" aria-hidden="true">
          arrow_forward
        </span>
      </>
    )
  }

  /* No token in the URL — the link is broken or expired */
  const invalidLink = !token

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-md sm:p-lg glass-background">
      {/* Skip to content link */}
      <a href="#reset-password-form" className="skip-to-main">
        Skip to reset password form
      </a>

      {/* Header Logo */}
      <header className="absolute top-0 left-0 w-full p-lg flex justify-center lg:justify-start">
        <Link to="/" aria-label="EventPro home">
          <EventProLogo />
        </Link>
      </header>

      <main className="w-full max-w-[480px] z-10" id="main-content">
        {/* Reset Password Card */}
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm p-xl sm:p-2xl">
          {invalidLink ? (
            /* Invalid / Missing Token View */
            <div className="text-center py-lg">
              <span
                className="material-symbols-outlined text-5xl text-error mb-md"
                aria-hidden="true"
              >
                link_off
              </span>
              <h2 className="font-headline-md text-headline-md text-on-surface mb-sm">
                Invalid reset link
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant mb-xl">
                This password reset link is invalid or has expired.
              </p>
              <Link
                className="text-primary font-label-md text-label-md hover:underline"
                to="/forgot-password"
              >
                Request a new link
              </Link>
            </div>
          ) : submitState === 'success' ? (
            /* Success View */
            <div className="text-center py-lg">
              <span
                className="material-symbols-outlined text-5xl text-primary mb-md"
                aria-hidden="true"
              >
                check_circle
              </span>
              <h2 className="font-headline-md text-headline-md text-on-surface mb-sm">
                Password reset successful
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant mb-xl">
                You can now sign in with your new password.
              </p>
              <Link
                className="text-primary font-label-md text-label-md hover:underline"
                to="/login"
              >
                Sign in
              </Link>
            </div>
          ) : (
            <>
              {/* Heading */}
              <div className="mb-xl text-center">
                <h1 className="font-headline-lg text-headline-lg text-on-surface mb-xs">
                  Set a new password
                </h1>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Choose a new password for your account.
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

              {/* Reset Password Form */}
              <form
                id="reset-password-form"
                className="space-y-lg"
                onSubmit={handleSubmit}
                noValidate
                aria-label="Reset password form"
              >
                <FormInput
                  id="newPassword"
                  label="New Password"
                  type="password"
                  icon="lock"
                  placeholder="Min. 6 characters"
                  required
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value)
                    if (fieldErrors.newPassword) setFieldErrors((prev) => ({ ...prev, newPassword: '' }))
                  }}
                  error={fieldErrors.newPassword}
                  autoComplete="new-password"
                />

                <FormInput
                  id="confirmPassword"
                  label="Confirm New Password"
                  type="password"
                  icon="lock"
                  placeholder="Re-enter your new password"
                  required
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value)
                    if (fieldErrors.confirmPassword) setFieldErrors((prev) => ({ ...prev, confirmPassword: '' }))
                  }}
                  error={fieldErrors.confirmPassword}
                  autoComplete="new-password"
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
                  Changed your mind?{' '}
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

export default ResetPassword
