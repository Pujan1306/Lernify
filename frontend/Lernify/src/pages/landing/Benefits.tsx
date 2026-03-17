import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { CheckCircle2, TrendingUp } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function Benefits() {
  const containerRef = useRef<HTMLDivElement>(null);
  const benefits = [
    "Study smarter, not harder",
    "Save hours creating study materials",
    "Improve retention with AI-powered tools",
    "Access anywhere, anytime"
  ];

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 75%",
        toggleActions: "play none none reverse"
      }
    });

    tl.fromTo('.benefits-header',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
    )
    .fromTo('.benefits-item',
      { opacity: 0, x: -30 },
      { opacity: 1, x: 0, duration: 0.6, stagger: 0.15, ease: 'power3.out' },
      "-=0.4"
    )
    .fromTo('.benefits-image',
      { opacity: 0, x: 50, scale: 0.95 },
      { opacity: 1, x: 0, scale: 1, duration: 1, ease: 'power3.out' },
      "-=0.8"
    )
    .fromTo('.benefits-badge',
      { opacity: 0, y: 20, scale: 0.8 },
      { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.2, ease: 'back.out(1.5)' },
      "-=0.4"
    );
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="py-24 px-6 md:px-12 bg-background relative overflow-hidden border-t border-white/5">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Content */}
          <div>
            <div className="benefits-header opacity-0">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
                <TrendingUp className="w-4 h-4" />
                <span>Benefits</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-display uppercase tracking-wider text-white mb-6 leading-tight">
                Unlock Your <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 via-emerald-400 to-amber-400">Full Potential</span>
              </h2>
              <p className="text-slate-400 text-lg mb-10 max-w-xl">
                Experience a new way of learning. Our platform provides the tools you need to maximize your study efficiency and achieve your goals faster.
              </p>
            </div>
            
            <ul className="space-y-6">
              {benefits.map((benefit, index) => (
                <li key={index} className="benefits-item opacity-0 flex items-start gap-4">
                  <div className="mt-1 bg-primary/20 p-1.5 rounded-full shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-slate-200 text-lg font-medium">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Image */}
          <div className="benefits-image opacity-0 relative">
            {/* Background Glow */}
            <div className="absolute -inset-4 bg-linear-to-t from-primary/20 to-blue-500/20 blur-3xl rounded-full opacity-50"></div>
            
            {/* Main Image Container */}
            <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl group">
              <div className="absolute inset-0 bg-linear-to-t from-[#0a0c10] via-transparent to-transparent opacity-60 z-10"></div>
              <img 
                src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop" 
                alt="Student studying on laptop" 
                className="w-full h-[400px] md:h-[500px] object-cover transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              
              {/* Floating Badge */}
              <div className="benefits-badge opacity-0 absolute bottom-6 left-6 bg-background/80 backdrop-blur-md border border-white/10 p-4 rounded-xl shadow-lg flex items-center gap-4 z-20 transform transition-transform group-hover:-translate-y-2">
                <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center border border-emerald-500/30">
                  <span className="text-emerald-400 font-bold text-xl">A+</span>
                </div>
                <div>
                  <p className="text-white font-medium">Better Grades</p>
                  <p className="text-slate-400 text-sm">Proven results</p>
                </div>
              </div>

              {/* Secondary Floating Badge */}
              <div className="benefits-badge opacity-0 absolute top-6 right-6 bg-background/80 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full shadow-lg flex items-center gap-2 z-20 transform transition-transform group-hover:translate-y-2">
                <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></div>
                <span className="text-slate-200 text-sm font-medium">AI Powered</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
