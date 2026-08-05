import Navbar from './Navbar'
import Footer from './Footer'
import Reveal from './Reveal'

export const DocPageHeader = ({ eyebrow, title, description, updated }) => (
  <Reveal>
    <div className="mb-12 md:mb-16">
      {eyebrow && (
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary font-label-md font-semibold text-sm uppercase tracking-wider mb-4">
          {eyebrow}
        </span>
      )}
      <h1 className="font-display-lg text-3xl md:text-4xl font-bold text-on-surface tracking-tight mb-3">
        {title}
      </h1>
      {description && (
        <p className="font-body-lg text-body-lg text-on-surface-variant">
          {description}
        </p>
      )}
      {updated && (
        <p className="text-body-sm text-on-surface-variant mt-4">
          Last updated: {updated}
        </p>
      )}
    </div>
  </Reveal>
)

export const DocSection = ({ title, children }) => (
  <Reveal>
    <section className="mb-10">
      <h2 className="font-headline-md text-headline-md text-on-surface mb-3">
        {title}
      </h2>
      <div className="font-body-md text-body-md text-on-surface-variant space-y-3">
        {children}
      </div>
    </section>
  </Reveal>
)

const DocPageLayout = ({ children }) => (
  <div className="min-h-screen bg-surface-bright flex flex-col">
    <Navbar />
    <main id="main-content" className="flex-1 pt-24 md:pt-32">
      <div className="max-w-3xl mx-auto px-lg sm:px-xl pb-16 md:pb-24">
        {children}
      </div>
    </main>
    <Footer />
  </div>
)

export default DocPageLayout
