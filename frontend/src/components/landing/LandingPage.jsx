import Navbar from './Navbar'
import Hero from './Hero'
import TechMarquee from './TechMarquee'
import Features from './Features'
import HowItWorks from './HowItWorks'
import DashboardShowcase from './DashboardShowcase'
import Security from './Security'
import Architecture from './Architecture'
import CallToAction from './CallToAction'
import Footer from './Footer'

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-surface-bright flex flex-col">
      <Navbar />
      <main id="main-content" className="flex-1">
        <Hero />
        <TechMarquee />
        <Features />
        <HowItWorks />
        <DashboardShowcase />
        <Security />
        <Architecture />
        <CallToAction />
      </main>
      <Footer />
    </div>
  )
}

export default LandingPage
