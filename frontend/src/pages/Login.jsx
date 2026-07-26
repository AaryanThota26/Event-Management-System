import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import EventProLogo from '../components/EventProLogo'
import SocialButton from '../components/SocialButton'
import FormInput from '../components/FormInput'

const GOOGLE_ICON =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAIeKiyBHRWTYjo2aqJxS8XZkjKvy5b93RrTBB0l0TnDK0ffX00a0FCSTvO0OoKzrNzPYvzy7D2y7JvublfH7M97dl06YiUGz-wkhra3yAdRNHsUnm0s2AQoW7lgehvCRZO8KTguDPHMSWrjr5E56YXQx0e6XWJl8owMpF_Tk85rM4nhK-0HYNGvvcOo4qI_qgQoF26Mwm9RVb13VMJEcILLXAvCowJLV38VVSj_oVRjfGdDbp0sVIq5ZJmsRBEHWFtVLxu26RKvL8'

const APPLE_ICON =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBaibZlrnKgvxTLeGHmlbONqDvfoSj84epcvvMAcj92Ui5eRhUqUkrLh8SCldvsMcwBShCvqJ67mjSZhgMdKVLMD8GrSJl75wVwZTbR4rsHeK2UTirsBvCPHy3mtfXqwJtwAERNfUmSWE080oP0ZSWgtlMDejIDB8PfiWfv3BfMQGzsPZg6dBMfdGkaO6BAOZbeDV5Fx9iLlynjK1gNQG76IAKU54Uzt8ZB-WTI8wNrJD5_P0g6CK6fQzJgMODbkjBELthyl3hAmIA'

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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!email.trim()) {
      setError('Email is required')
      return
    }
    if (!password) {
      setError('Password is required')
      return
    }

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
      setError(result.message)
    }
  }

  const getButtonContent = () => {
    if (submitState === 'loading') {
      return (
        <>
          <span className="material-symbols-outlined animate-spin">sync</span>
          <span>Authenticating...</span>
        </>
      )
    }
    if (submitState === 'success') {
      return (
        <>
          <span className="material-symbols-outlined">check_circle</span>
          <span>Success</span>
        </>
      )
    }
    return (
      <>
        <span>Sign in to Dashboard</span>
        <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
          arrow_forward
        </span>
      </>
    )
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-md glass-background">
      {/* Header Logo */}
      <header className="absolute top-0 left-0 w-full p-lg flex justify-center lg:justify-start">
        <EventProLogo />
      </header>

      <main className="w-full max-w-[480px] z-10">
        {/* Login Card */}
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm p-xl lg:p-2xl">
          {/* Heading */}
          <div className="mb-xl text-center">
            <h1 className="font-headline-lg text-headline-lg text-on-surface mb-xs">
              Welcome back
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Manage your high-stakes events with confidence.
            </p>
          </div>

          {/* Social Login Buttons */}
          <div className="flex flex-col sm:flex-row gap-md mb-xl">
            <SocialButton icon={GOOGLE_ICON} label="Google" />
            <SocialButton icon={APPLE_ICON} label="Apple" />
          </div>

          {/* Divider */}
          <div className="relative mb-xl">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-outline-variant"></div>
            </div>
            <div className="relative flex justify-center text-label-sm text-label-sm uppercase">
              <span className="bg-surface-container-lowest px-md text-on-surface-variant">
                Or continue with email
              </span>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-lg px-md py-sm rounded-lg bg-error-container text-on-error-container font-body-sm text-body-sm">
              {error}
            </div>
          )}

          {/* Login Form */}
          <form className="space-y-lg" onSubmit={handleSubmit}>
            <FormInput
              id="email"
              label="Email Address"
              type="email"
              icon="mail"
              placeholder="name@company.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <FormInput
              id="password"
              label="Password"
              type="password"
              icon="lock"
              placeholder="••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              rightElement={
                <a
                  className="font-label-sm text-label-sm text-primary hover:underline"
                  href="#"
                >
                  Forgot password?
                </a>
              }
            />

            {/* Remember me */}
            <div className="flex items-center gap-sm">
              <input
                className="w-4 h-4 text-primary border-outline-variant rounded focus:ring-primary"
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
              } ${submitState === 'loading' ? 'opacity-80' : ''}`}
              type="submit"
              disabled={submitState === 'loading'}
            >
              {getButtonContent()}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-xl text-center">
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Don't have an account?{' '}
              <a
                className="text-primary font-label-md text-label-md hover:underline"
                href="#"
              >
                Create an account
              </a>
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
      <div className="fixed bottom-0 right-0 w-1/3 h-1/3 -z-10 opacity-20 pointer-events-none">
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary rounded-full blur-[120px]"></div>
      </div>
    </div>
  )
}

export default Login
