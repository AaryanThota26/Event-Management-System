import Reveal from './Reveal'
import SectionHeading from './SectionHeading'

const Arrow = ({ label }) => (
  <div className="flex flex-col items-center py-sm" aria-hidden="true">
    <span className="text-body-sm text-on-surface-variant mb-xs">{label}</span>
    <span className="material-symbols-outlined text-primary">south</span>
  </div>
)

const StackNode = ({ icon, title, subtitle, detail, badge }) => (
  <div className="w-full max-w-xl mx-auto rounded-2xl bg-surface-container-lowest border border-outline-variant p-xl flex items-start gap-lg shadow-sm">
    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
      <span className="material-symbols-outlined text-primary text-2xl" aria-hidden="true">
        {icon}
      </span>
    </div>
    <div className="min-w-0">
      <div className="flex flex-wrap items-center gap-sm mb-xs">
        <h3 className="font-headline-sm text-headline-sm text-on-surface">{title}</h3>
        {badge && (
          <span className="px-sm py-xs rounded-lg bg-primary-fixed text-on-primary-fixed text-label-sm font-bold uppercase tracking-wider">
            {badge}
          </span>
        )}
      </div>
      <p className="text-label-md text-primary font-semibold mb-xs">{subtitle}</p>
      <p className="font-body-sm text-body-sm text-on-surface-variant">{detail}</p>
    </div>
  </div>
)

const Architecture = () => {
  return (
    <section className="landing-section landing-section--alt" id="architecture">
      <div className="max-w-[1440px] mx-auto px-lg sm:px-xl">
        <SectionHeading
          eyebrow="Architecture"
          title="A clean three-tier design"
          description="React drives the interface, FastAPI enforces the rules, and Postgres + Resend keep the system moving."
        />

        <Reveal>
          <StackNode
            icon="web"
            title="React Frontend"
            subtitle="React 19 · Vite 8 · Tailwind CSS · deployed on Vercel"
            detail="Role-based dashboards for users, organizers, and admins talk to the API over Axios."
            badge="Vercel"
          />
        </Reveal>

        <Arrow label="HTTPS · JSON API" />

        <Reveal>
          <StackNode
            icon="api"
            title="FastAPI Backend"
            subtitle="FastAPI 0.115 · SQLAlchemy 2.0 · Python 3.12 · deployed on Render"
            detail="JWT auth, role guards, event moderation, and registration logic all live server-side."
            badge="Render"
          />
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-md mt-sm">
          <Reveal delay={0.05}>
            <StackNode
              icon="storage"
              title="PostgreSQL"
              subtitle="Neon · serverless Postgres"
              detail="Users, events, and registrations persisted with SQLAlchemy models."
            />
          </Reveal>
          <Reveal delay={0.1}>
            <StackNode
              icon="mail"
              title="Resend"
              subtitle="Transactional email API"
              detail="Password reset links and account emails delivered reliably."
            />
          </Reveal>
        </div>
      </div>
    </section>
  )
}

export default Architecture
