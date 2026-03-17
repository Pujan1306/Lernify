import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import UnicornScene from 'unicornstudio-react';
import { useNavigate } from 'react-router-dom';

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.fromTo('.hero-badge', 
      { opacity: 0, y: 20 }, 
      { opacity: 1, y: 0, duration: 0.8, delay: 0.2 }
    )
    .fromTo('.hero-title',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1 },
      "-=0.6"
    )
    .fromTo('.hero-desc',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.15 },
      "-=0.6"
    )
    .fromTo('.hero-buttons button',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.1 },
      "-=0.4"
    );
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="relative min-h-screen flex flex-col items-center justify-center pt-20">
      {/* Unicorn Studio Background */}
      <div className="absolute inset-0 z-0">
      <UnicornScene
        projectId="nA8ZeFBVYh91AVjVfW2a"
        width="100%"
        height="100%"
      />
      </div>
      
      {/* Gradient overlay to blend into the next section */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-linear-to-t from-background to-transparent z-0 pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <div className="hero-badge flex items-center justify-center gap-3 mb-8 opacity-0">
          <span className="w-1 h-1 rounded-full bg-primary" />
          <span className="text-[10px] md:text-xs font-mono tracking-[0.15em] text-white/70 uppercase">
            AI Infrastructure for Builders
          </span>
          <span className="w-1 h-1 rounded-full bg-primary" />
        </div>

        <h1 className="hero-title font-display text-6xl md:text-7xl tracking-normal leading-[0.9] mb-6 uppercase text-white opacity-0">
          Transform Your Learning<br />
          <span className="text-green-500">with AI-Powered Tools.</span>
        </h1>

        <p className="hero-desc text-lg  text-black/70 font-medium mb-5 max-w-2xl mx-auto tracking-tight opacity-0">
          Lernify helps you learn faster using AI-powered flashcards, quizzes, and study tools.
        </p>

        <p className="hero-desc text-sm md:text-base text-black/70 font-mediummb-10 max-w-xl mx-auto leading-relaxed opacity-0">
          Upload documents, generate smart flashcards, and test your knowledge with AI-created quizzes.
        </p>

        <div className="hero-buttons flex flex-col sm:flex-row items-center justify-center gap-4">
          <button onClick={() => navigate("/register")} className="w-full sm:w-auto bg-primary hover:opacity-90 text-primary-foreground px-6 py-2.5 rounded-md text-sm font-medium transition-colors shadow-sm opacity-0">
            Get Started for Free
          </button>
          <button className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white px-6 py-2.5 rounded-md text-sm font-medium transition-colors shadow-sm border border-white/20 backdrop-blur-sm opacity-0">
            View the System
          </button>
        </div>
      </div>
    </section>
  );
}
