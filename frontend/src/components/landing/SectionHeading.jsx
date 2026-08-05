import Reveal from './Reveal'

const SectionHeading = ({ eyebrow, title, description, align = 'center' }) => {
  const alignment =
    align === 'center' ? 'items-center text-center' : 'items-start text-left'
  return (
    <Reveal className={`flex flex-col ${alignment} mb-12 md:mb-16`}>
      {eyebrow && (
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary font-label-md font-semibold text-sm uppercase tracking-wider mb-4">
          {eyebrow}
        </span>
      )}
      <h2 className="font-headline-lg text-headline-lg md:text-4xl font-bold text-on-surface tracking-tight mb-4 max-w-2xl">
        {title}
      </h2>
      {description && (
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
          {description}
        </p>
      )}
    </Reveal>
  )
}

export default SectionHeading
