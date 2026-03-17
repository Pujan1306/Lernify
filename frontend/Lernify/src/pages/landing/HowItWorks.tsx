import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { FileText, Layers, HelpCircle, MessageSquare } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const GeminiLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="gemini-gradient" x1="15%" y1="0%" x2="85%" y2="100%">
        <stop offset="0%" stopColor="#EA4335" />
        <stop offset="30%" stopColor="#FBBC05" />
        <stop offset="70%" stopColor="#34A853" />
        <stop offset="100%" stopColor="#4285F4" />
      </linearGradient>
    </defs>
    <path d="M12.0001 2.3999C12.0001 7.70194 16.298 11.9999 21.6 11.9999C16.298 11.9999 12.0001 16.2979 12.0001 21.5999C12.0001 16.2979 7.7021 11.9999 2.4001 11.9999C7.7021 11.9999 12.0001 7.70194 12.0001 2.3999Z" fill="url(#gemini-gradient)"/>
  </svg>
);

export default function HowItWorks() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 75%",
        toggleActions: "play none none reverse"
      }
    });

    tl.fromTo('.hiw-header',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
    )
    .fromTo('.hiw-node',
      { opacity: 0, scale: 0.5, y: 20 },
      { opacity: 1, scale: 1, y: 0, duration: 0.6, stagger: 0.15, ease: 'back.out(1.5)' },
      "-=0.4"
    )
    .fromTo('.hiw-svg',
      { opacity: 0 },
      { opacity: 1, duration: 1 },
      "-=0.4"
    );
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="py-24 px-6 md:px-12 bg-background relative overflow-hidden border-t border-white/5">
      <div className="max-w-5xl mx-auto relative z-10">
        <div className="hiw-header text-center opacity-0">
          <h2 className="text-3xl md:text-4xl font-display uppercase tracking-wider text-white mb-3">How It Works</h2>
          <p className="text-slate-400 text-base max-w-2xl mx-auto">
            A simple 3-step process to transform your study materials into interactive learning tools.
          </p>
        </div>

        {/* Clean container without background/borders */}
        <div className="relative w-full h-[500px] md:h-[600px]">
          
          <style>{`
            @keyframes beam-in {
              0% { stroke-dashoffset: 20; opacity: 0; }
              5% { opacity: 1; }
              45% { stroke-dashoffset: -100; opacity: 1; }
              50% { stroke-dashoffset: -100; opacity: 0; }
              100% { stroke-dashoffset: -100; opacity: 0; }
            }
            @keyframes beam-out {
              0% { stroke-dashoffset: 20; opacity: 0; }
              50% { stroke-dashoffset: 20; opacity: 0; }
              55% { opacity: 1; }
              95% { stroke-dashoffset: -100; opacity: 1; }
              100% { stroke-dashoffset: -100; opacity: 0; }
            }
            @keyframes node-pulse {
              0%, 40% { box-shadow: 0 0 30px rgba(66,133,244,0.2); transform: scale(1); }
              48% { box-shadow: 0 0 80px rgba(66,133,244,0.6); transform: scale(1.1); }
              56%, 100% { box-shadow: 0 0 30px rgba(66,133,244,0.2); transform: scale(1); }
            }
            .animate-beam-in {
              animation: beam-in 2.5s ease-in-out infinite;
            }
            .animate-beam-out {
              animation: beam-out 2.5s ease-in-out infinite;
            }
            .animate-node-pulse {
              animation: node-pulse 2.5s ease-in-out infinite;
            }
          `}</style>

          {/* Desktop SVG - Smooth Bezier Curves */}
          <svg className="hiw-svg opacity-0 absolute inset-0 w-full h-full pointer-events-none hidden md:block" viewBox="0 0 1000 600" preserveAspectRatio="none">
            <defs>
              <filter id="glow-desktop" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Base Lines */}
            <g stroke="rgba(255,255,255,0.05)" strokeWidth="2" fill="none">
              <path d="M 200 300 L 500 300" />
              <path d="M 500 300 C 650 300, 650 150, 800 150" />
              <path d="M 500 300 C 650 300, 650 300, 800 300" />
              <path d="M 500 300 C 650 300, 650 450, 800 450" />
            </g>

            {/* Animated Beams */}
            <g stroke="#10b981" strokeWidth="3" fill="none" strokeLinecap="round" filter="url(#glow-desktop)">
              <path d="M 200 300 L 500 300" strokeDasharray="20 100" pathLength="100" className="animate-beam-in" />
              <path d="M 500 300 C 650 300, 650 150, 800 150" strokeDasharray="20 100" pathLength="100" className="animate-beam-out" />
              <path d="M 500 300 C 650 300, 650 300, 800 300" strokeDasharray="20 100" pathLength="100" className="animate-beam-out" />
              <path d="M 500 300 C 650 300, 650 450, 800 450" strokeDasharray="20 100" pathLength="100" className="animate-beam-out" />
            </g>
          </svg>

          {/* Mobile SVG - Smooth Bezier Curves */}
          <svg className="hiw-svg opacity-0 absolute inset-0 w-full h-full pointer-events-none md:hidden" viewBox="0 0 400 800" preserveAspectRatio="none">
            <defs>
              <filter id="glow-mobile" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Base Lines */}
            <g stroke="rgba(255,255,255,0.05)" strokeWidth="2" fill="none">
              <path d="M 200 160 L 200 400" />
              <path d="M 200 400 C 200 520, 80 520, 80 640" />
              <path d="M 200 400 C 200 520, 200 520, 200 640" />
              <path d="M 200 400 C 200 520, 320 520, 320 640" />
            </g>

            {/* Animated Beams */}
            <g stroke="#10b981" strokeWidth="3" fill="none" strokeLinecap="round" filter="url(#glow-mobile)">
              <path d="M 200 160 L 200 400" strokeDasharray="20 100" pathLength="100" className="animate-beam-in" />
              <path d="M 200 400 C 200 520, 80 520, 80 640" strokeDasharray="20 100" pathLength="100" className="animate-beam-out" />
              <path d="M 200 400 C 200 520, 200 520, 200 640" strokeDasharray="20 100" pathLength="100" className="animate-beam-out" />
              <path d="M 200 400 C 200 520, 320 520, 320 640" strokeDasharray="20 100" pathLength="100" className="animate-beam-out" />
            </g>
          </svg>

          {/* Nodes */}
          
          {/* Left 1: PDF */}
          <div className="absolute left-[50%] md:left-[20%] top-[20%] md:top-[50%] -translate-x-1/2 -translate-y-1/2">
            <div className="hiw-node opacity-0 flex flex-col items-center">
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-[#171b26] border border-white/10 flex items-center justify-center shadow-lg relative z-10 transition-transform hover:scale-110">
                <FileText className="text-blue-400 w-5 h-5 md:w-6 md:h-6" />
              </div>
              <span className="absolute top-full left-1/2 -translate-x-1/2 mt-3 text-[10px] md:text-sm font-medium text-slate-400 text-center w-24">Documents</span>
            </div>
          </div>

          {/* Center: AI */}
          <div className="absolute left-[50%] top-[50%] -translate-x-1/2 -translate-y-1/2">
            <div className="hiw-node opacity-0 flex flex-col items-center">
              <div className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-[#171b26] border border-white/10 flex items-center justify-center shadow-[0_0_40px_rgba(66,133,244,0.2)] relative z-10 animate-node-pulse">
                <GeminiLogo className="w-8 h-8 md:w-10 md:h-10" />
              </div>
              <span className="absolute top-full left-1/2 -translate-x-1/2 mt-4 text-xs md:text-sm font-bold text-white text-center w-24">Gemini AI</span>
            </div>
          </div>

          {/* Right 1 / Bottom 1: Flashcards */}
          <div className="absolute left-[20%] md:left-[80%] top-[80%] md:top-[25%] -translate-x-1/2 -translate-y-1/2">
            <div className="hiw-node opacity-0 flex flex-col items-center">
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-[#171b26] border border-white/10 flex items-center justify-center shadow-lg relative z-10 transition-transform hover:scale-110">
                <Layers className="text-amber-400 w-5 h-5 md:w-6 md:h-6" />
              </div>
              <span className="absolute top-full left-1/2 -translate-x-1/2 mt-3 text-[10px] md:text-sm font-medium text-slate-400 text-center w-24">Flashcards</span>
            </div>
          </div>

          {/* Right 2 / Bottom 2: Quizzes */}
          <div className="absolute left-[50%] md:left-[80%] top-[80%] md:top-[50%] -translate-x-1/2 -translate-y-1/2">
            <div className="hiw-node opacity-0 flex flex-col items-center">
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-[#171b26] border border-white/10 flex items-center justify-center shadow-lg relative z-10 transition-transform hover:scale-110">
                <HelpCircle className="text-purple-400 w-5 h-5 md:w-6 md:h-6" />
              </div>
              <span className="absolute top-full left-1/2 -translate-x-1/2 mt-3 text-[10px] md:text-sm font-medium text-slate-400 text-center w-24">Quizzes</span>
            </div>
          </div>

          {/* Right 3 / Bottom 3: Chat */}
          <div className="absolute left-[80%] md:left-[80%] top-[80%] md:top-[75%] -translate-x-1/2 -translate-y-1/2">
            <div className="hiw-node opacity-0 flex flex-col items-center">
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-[#171b26] border border-white/10 flex items-center justify-center shadow-lg relative z-10 transition-transform hover:scale-110">
                <MessageSquare className="text-emerald-400 w-5 h-5 md:w-6 md:h-6" />
              </div>
              <span className="absolute top-full left-1/2 -translate-x-1/2 mt-3 text-[10px] md:text-sm font-medium text-slate-400 text-center w-24">AI Chat</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
