import Reveal from './Reveal'

const SECURITY_ITEMS = [
  {
    icon: 'lock',
    title: 'JWT authentication',
    description:
      'Every request is guarded by short-lived, signed access tokens issued at login.',
  },
  {
    icon: 'admin_panel_settings',
    title: 'Role-based access',
    description:
      'User, organizer, and admin roles gate every route and action server-side.',
  },
  {
    icon: 'password',
    title: 'Password reset',
    description:
      'Forgot it? A tokenized reset flow sends a secure link via Resend email.',
  },
  {
    icon: 'shield',
    title: 'bcrypt hashing',
    description:
      'Passwords are hashed with bcrypt salts — never stored, never logged.',
  },
]

const Security = () => {
  return (
    <section className="landing-section bg-on-background text-white" id="security">
      <div className="max-w-[1440px] mx-auto px-lg sm:px-xl">
        <Reveal className="text-center mb-12 md:mb-16">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-primary-fixed font-label-md font-semibold text-sm uppercase tracking-wider mb-4">
            Security
          </span>
          <h2 className="font-headline-lg text-headline-lg md:text-4xl font-bold text-white tracking-tight mb-4">
            Security is built in, not bolted on
          </h2>
          <p className="font-body-lg text-body-lg text-inverse-on-surface/80 max-w-2xl mx-auto">
            EventPro treats access control and credential safety as core
            architecture, verified at every layer.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-md">
          {SECURITY_ITEMS.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.06}>
              <div className="h-full rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-xl hover:bg-white/10 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-primary-container flex items-center justify-center mb-lg">
                  <span className="material-symbols-outlined text-on-primary text-2xl" aria-hidden="true">
                    {item.icon}
                  </span>
                </div>
                <h3 className="font-headline-sm text-headline-sm text-white mb-sm">
                  {item.title}
                </h3>
                <p className="font-body-sm text-body-sm text-inverse-on-surface/70">
                  {item.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Security
