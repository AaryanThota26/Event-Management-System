import Reveal from './Reveal'
import SectionHeading from './SectionHeading'

const FEATURES = [
  {
    icon: 'add_circle',
    title: 'Create events in seconds',
    description:
      'Organizers publish events with title, date, time, location, and capacity — then send them to review.',
    role: 'Organizers',
  },
  {
    icon: 'verified_user',
    title: 'Moderation queue',
    description:
      'Admins approve or reject submissions from a single queue. Nothing goes live until it is approved.',
    role: 'Admins',
  },
  {
    icon: 'how_to_reg',
    title: 'One-click registration',
    description:
      'Attendees register in a single click and track every event they have joined.',
    role: 'Users',
  },
  {
    icon: 'group',
    title: 'Participant management',
    description:
      'Organizers open the participant list for any event and see exactly who is coming.',
    role: 'Organizers',
  },
  {
    icon: 'search',
    title: 'Search & browse',
    description:
      'Discover upcoming events by keyword, date, or location across a fast, filterable feed.',
    role: 'Users',
  },
  {
    icon: 'lock',
    title: 'Role-based access',
    description:
      'JWT-secured auth with distinct workspaces for users, organizers, and admins.',
    role: 'Everyone',
  },
]

const Features = () => {
  return (
    <section className="landing-section bg-surface-bright anchor-target" id="features">
      <div className="max-w-[1440px] mx-auto px-lg sm:px-xl">
        <SectionHeading
          eyebrow="Features"
          title="Everything you need to run great events"
          description="Three roles, one workflow. Every feature below ships with EventPro today."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md">
          {FEATURES.map((feature, i) => (
            <Reveal key={feature.title} delay={i * 0.06}>
              <div className="h-full bg-surface-container-lowest rounded-xl border border-outline-variant p-xl hover:shadow-md hover:border-primary/30 hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-lg">
                  <span className="material-symbols-outlined text-primary text-2xl" aria-hidden="true">
                    {feature.icon}
                  </span>
                </div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface mb-sm">
                  {feature.title}
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant mb-lg">
                  {feature.description}
                </p>
                <span className="text-label-sm text-primary font-semibold uppercase tracking-wider">
                  {feature.role}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features
