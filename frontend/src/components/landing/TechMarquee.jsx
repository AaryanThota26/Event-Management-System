import Reveal from './Reveal'

const TECHNOLOGIES = [
  { name: 'React 19', icon: 'code' },
  { name: 'Vite 8', icon: 'bolt' },
  { name: 'Tailwind CSS', icon: 'palette' },
  { name: 'Axios', icon: 'swap_horiz' },
  { name: 'Framer Motion', icon: 'animation' },
  { name: 'FastAPI', icon: 'rocket_launch' },
  { name: 'SQLAlchemy', icon: 'database' },
  { name: 'PostgreSQL', icon: 'storage' },
  { name: 'Python 3.12', icon: 'terminal' },
  { name: 'JWT', icon: 'key' },
  { name: 'bcrypt', icon: 'lock' },
  { name: 'Resend', icon: 'mail' },
]

const TechChip = ({ tech }) => (
  <div className="flex items-center gap-sm px-lg py-md rounded-full bg-surface-container-lowest border border-outline-variant whitespace-nowrap">
    <span className="material-symbols-outlined text-[18px] text-primary" aria-hidden="true">
      {tech.icon}
    </span>
    <span className="font-label-md text-label-md text-on-surface">{tech.name}</span>
  </div>
)

const TechMarquee = () => {
  const doubled = [...TECHNOLOGIES, ...TECHNOLOGIES]
  return (
    <section className="landing-section border-y border-outline-variant/60 bg-surface-bright" id="tech-stack" aria-label="Technology stack">
      <div className="max-w-[1440px] mx-auto px-lg sm:px-xl">
        <Reveal className="text-center mb-10">
          <h2 className="font-headline-md text-headline-md font-semibold text-on-surface tracking-tight">
            Built on a modern, production-ready stack
          </h2>
          <p className="text-body-sm text-on-surface-variant mt-2">
            Every layer of EventPro is battle-tested and maintained.
          </p>
        </Reveal>
      </div>
      <div className="tech-marquee">
        <div className="tech-marquee__track">
          {doubled.map((tech, i) => (
            <TechChip key={`${tech.name}-${i}`} tech={tech} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default TechMarquee
