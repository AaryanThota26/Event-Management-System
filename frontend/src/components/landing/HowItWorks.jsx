import Reveal from './Reveal'
import SectionHeading from './SectionHeading'

const STEPS = [
  {
    icon: 'calendar_month',
    role: 'Organizer',
    title: 'Create',
    description:
      'Draft an event with date, time, location, and capacity. It goes straight into the review queue.',
  },
  {
    icon: 'fact_check',
    role: 'Admin',
    title: 'Approve',
    description:
      'Review submissions in the moderation queue and approve the ones that are ready to go live.',
  },
  {
    icon: 'how_to_reg',
    role: 'User',
    title: 'Register',
    description:
      'Browse the approved event feed and register in one click. No forms, no friction.',
  },
]

const HowItWorks = () => {
  return (
    <section className="landing-section landing-section--alt" id="how-it-works">
      <div className="max-w-[1440px] mx-auto px-lg sm:px-xl">
        <SectionHeading
          eyebrow="How It Works"
          title="A workflow every role already understands"
          description="From draft to full house in three clear steps."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
          {STEPS.map((step, i) => (
            <Reveal key={step.role} delay={i * 0.1}>
              <div className="relative h-full bg-surface-container-lowest rounded-2xl border border-outline-variant p-xl">
                <span className="absolute top-xl right-xl text-display-lg font-bold text-outline-variant/50" aria-hidden="true">
                  0{i + 1}
                </span>
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center mb-lg">
                  <span className="material-symbols-outlined text-on-primary text-2xl" aria-hidden="true">
                    {step.icon}
                  </span>
                </div>
                <p className="text-label-sm text-primary font-semibold uppercase tracking-wider mb-sm">
                  {step.role}
                </p>
                <h3 className="font-headline-md text-headline-md text-on-surface mb-sm">
                  {step.title}
                </h3>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  {step.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
