import Navbar from './Navbar';
import Hero from './Hero';
import Dashboard from './Dashboard';
import Features from './Features';
import HowItWorks from './HowItWorks';
import Benefits from './Benefits';
import CTA from './CTA';
import Footer from './Footer';

export default function LandingPage() {
  return (
    <div className="dark min-h-screen w-full overflow-x-hidden bg-background text-foreground font-sans selection:bg-primary/30">
      <Navbar />
      <Hero />
      <div id="dashboard">
        <Dashboard />
      </div>
      <div id="features">
        <Features />
      </div>
      <div id="how-it-works">
        <HowItWorks />
      </div>
      <div id="benefits">
        <Benefits />
      </div>
      <div id="cta">
        <CTA />
      </div>
      <div id="contact">
        <Footer />
      </div>
    </div>
  );
}