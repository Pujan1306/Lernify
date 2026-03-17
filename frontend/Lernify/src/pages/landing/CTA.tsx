import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

export default function CTA() {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 80%",
        toggleActions: "play none none reverse"
      }
    });

    tl.fromTo('.cta-glow',
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 0.5, duration: 1.5, ease: 'power2.out' }
    )
    .fromTo('.cta-content > *',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out' },
      "-=1"
    );
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="py-24 px-6 md:px-12 bg-background relative overflow-hidden border-t border-white/5">
      {/* Background Glows */}
      <div className="cta-glow opacity-0 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="cta-content max-w-4xl mx-auto relative z-10 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6 opacity-0">
          <Sparkles className="w-4 h-4" />
          <span>Start Learning Today</span>
        </div>
        
        <h2 className="text-4xl md:text-6xl font-display uppercase tracking-wider text-white mb-6 opacity-0">
          Ready to <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 via-emerald-400 to-amber-400">Get Started?</span>
        </h2>
        
        <p className="text-slate-400 text-lg md:text-xl mb-10 max-w-2xl mx-auto opacity-0">
          Join thousands of students who are already studying smarter, saving time, and getting better grades with our AI-powered platform.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 opacity-0">
          <button onClick={() => navigate("/register")} className="w-full sm:w-auto px-8 py-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-medium transition-all flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:shadow-[0_0_40px_rgba(16,185,129,0.5)] hover:-translate-y-1">
            Get Started for Free
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
