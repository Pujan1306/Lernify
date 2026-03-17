import { useState, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Menu, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const navigate = useNavigate();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
    setIsMobileMenuOpen(false);
  };

  useGSAP(() => {
    gsap.fromTo(navRef.current,
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.2 }
    );
  }, { scope: navRef });

  return (
    <>
      <svg className="hidden" width="0" height="0">
        <filter id="glass-distortion">
          <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="2" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>

      <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
        <header ref={navRef} className="glass-nav pointer-events-auto shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
          <div className="glass-filter"></div>
          <div className="glass-overlay"></div>
          <div className="glass-specular"></div>
          
          <div className="glass-content px-6 py-3 flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-xl font-display tracking-wider uppercase text-white">Lernify</span>
            </div>
            
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/80">
              <button onClick={() => scrollToSection('dashboard')} className="hover:text-white transition-colors">Preview</button>
              <button onClick={() => scrollToSection('features')} className="hover:text-white transition-colors">Features</button>
              <button onClick={() => scrollToSection('benefits')} className="hover:text-white transition-colors">Benefits</button>
              <button onClick={() => scrollToSection('contact')} className="hover:text-white transition-colors">Contact</button>
            </div>

            <div className="hidden md:flex items-center gap-4">
              <Link to="/login" className="text-sm font-medium text-white/80 hover:text-white transition-colors">Sign in</Link>
              <button onClick={() => navigate("/register")} className="bg-primary hover:opacity-90 text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm">
                Sign Up
              </button>
            </div>

            {/* Mobile Menu Toggle */}
            <button 
              className="md:hidden text-white/80 hover:text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Menu Dropdown */}
          {isMobileMenuOpen && (
            <div className="glass-content md:hidden border-t border-white/20 p-6 flex flex-col gap-4">
              <button onClick={() => scrollToSection('dashboard')} className="text-sm font-medium text-white/80 hover:text-white transition-colors text-left">Preview</button>
              <button onClick={() => scrollToSection('features')} className="text-sm font-medium text-white/80 hover:text-white transition-colors text-left">Features</button>
              <button onClick={() => scrollToSection('benefits')} className="text-sm font-medium text-white/80 hover:text-white transition-colors text-left">Benefits</button>
              <button onClick={() => scrollToSection('contact')} className="text-sm font-medium text-white/80 hover:text-white transition-colors text-left">Contact</button>
              <hr className="border-white/20 my-2" />
              <Link to="/login" className="text-sm font-medium text-white/80 hover:text-white transition-colors">Sign in</Link>
              <button onClick={() => navigate("/register")} className="bg-primary hover:opacity-90 text-primary-foreground px-5 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm w-full mt-2">
                Sign Up
              </button>
            </div>
          )}
        </header>
      </div>
    </>
  );
}
