import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { FileText, Layers, Brain, LayoutDashboard } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    step: "Feature 1",
    tag: "MANAGEMENT",
    title: "Document Management",
    description: "Upload PDFs, Word docs, and more. Organize your study materials and track reading progress effortlessly.",
    icon: <FileText size={16} className="text-[#0f1219]" />,
    active: true
  },
  {
    step: "Feature 2",
    tag: "RETENTION",
    title: "AI Flashcards",
    description: "Automatically generate flashcards from any document. Utilize spaced repetition for better retention and study on any device.",
    icon: <Layers size={16} className="text-[#0f1219]" />,
    active: true
  },
  {
    step: "Feature 3",
    tag: "ASSESSMENT",
    title: "Smart Quizzes",
    description: "AI creates personalized quizzes from your content. Answer multiple choice questions with instant feedback and track your scores and improvement.",
    icon: <Brain size={16} className="text-[#0f1219]" />,
    active: true
  },
  {
    step: "Feature 4",
    tag: "ANALYTICS",
    title: "Progress Dashboard",
    description: "Visual analytics of your learning journey. Track study streaks, completion rates, and receive personalized insights.",
    icon: <LayoutDashboard size={16} className="text-slate-300" />,
    active: false
  }
];

export default function Features() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Header animation
    gsap.fromTo('.features-header',
      { opacity: 0, y: 30 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 0.8, 
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.features-header',
          start: "top 85%",
          toggleActions: "play none none reverse"
        }
      }
    );

    // Center line animation
    gsap.fromTo('.features-line',
      { scaleY: 0 },
      {
        scaleY: 1,
        transformOrigin: "top center",
        ease: "none",
        scrollTrigger: {
          trigger: '.features-timeline',
          start: "top 60%",
          end: "bottom 80%",
          scrub: 1
        }
      }
    );

    // Feature items animation
    gsap.utils.toArray('.feature-item').forEach((item: any, i) => {
      const isEven = i % 2 === 0;
      const xOffset = isEven ? 50 : -50;
      
      gsap.fromTo(item,
        { opacity: 0, x: xOffset, y: 30 },
        {
          opacity: 1,
          x: 0,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: item,
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        }
      );
    });
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="py-16 px-6 md:px-12 bg-background relative overflow-hidden border-t border-white/5">
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="features-header text-center mb-16 opacity-0">
          <h2 className="text-3xl md:text-4xl font-display uppercase tracking-wider text-white mb-3">Core Features</h2>
          <p className="text-slate-400 text-base max-w-2xl mx-auto">
            Everything you need to master your subjects and accelerate your learning.
          </p>
        </div>

        <div className="features-timeline relative">
          <style>{`
            @keyframes feature-pulse {
              0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); }
              70% { box-shadow: 0 0 0 15px rgba(16, 185, 129, 0); }
              100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
            }
            .animate-feature-pulse {
              animation: feature-pulse 2s infinite;
            }
          `}</style>

          {/* Center Line */}
          <div className="features-line absolute left-8 md:left-1/2 top-0 bottom-0 w-[1px] bg-white/10 transform md:-translate-x-1/2 scale-y-0"></div>

          <div className="space-y-8 md:space-y-12">
            {features.map((feature, index) => {
              const isEven = index % 2 === 0; // 0, 2 are right side. 1, 3 are left side.
              
              return (
                <div key={index} className="feature-item opacity-0 relative flex flex-col md:flex-row items-start md:items-center w-full">
                  
                  {/* Icon */}
                  <div className="absolute left-8 md:left-1/2 transform -translate-x-1/2 flex items-center justify-center z-10 mt-6 md:mt-0">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 border-background ${feature.active ? 'bg-[#1a2e25] animate-feature-pulse' : 'bg-[#1e2433]'}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${feature.active ? 'bg-primary' : 'bg-transparent border border-white/20'}`}>
                        {feature.icon}
                      </div>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className={`w-full pl-24 md:pl-0 md:w-[calc(50%-2rem)] ${isEven ? 'md:ml-auto' : 'md:mr-auto'}`}>
                    <div className="bg-[#171b26] border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-colors shadow-xl">
                      <div className="flex justify-between items-center mb-3">
                        <span className={`font-bold text-sm ${feature.active ? 'text-primary' : 'text-slate-400'}`}>{feature.step}</span>
                        <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">{feature.tag}</span>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                      <p className="text-sm text-slate-400 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
