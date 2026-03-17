import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Github, Twitter, Linkedin, BookOpen } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 90%",
        toggleActions: "play none none reverse"
      }
    });

    tl.fromTo('.footer-col',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out' }
    )
    .fromTo('.footer-bottom',
      { opacity: 0 },
      { opacity: 1, duration: 0.6 },
      "-=0.2"
    );
  }, { scope: containerRef });

  return (
    <footer ref={containerRef} className="bg-[#0a0c10] pt-16 pb-8 px-6 md:px-12 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          
          {/* Brand Column */}
          <div className="footer-col opacity-0 col-span-1 md:col-span-4 lg:col-span-5">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/30">
                <BookOpen className="w-5 h-5 text-primary" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">StudyAI</span>
            </div>
            <p className="text-slate-400 text-sm mb-6 max-w-xs">
              Transforming the way students learn with AI-powered study tools, flashcards, and quizzes.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links Columns */}
          <div className="col-span-1 md:col-span-8 lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div className="footer-col opacity-0">
              <h3 className="text-white font-semibold mb-4">Product</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-slate-400 hover:text-primary transition-colors text-sm">Features</a></li>
                <li><a href="#" className="text-slate-400 hover:text-primary transition-colors text-sm">Pricing</a></li>
                <li><a href="#" className="text-slate-400 hover:text-primary transition-colors text-sm">Use Cases</a></li>
                <li><a href="#" className="text-slate-400 hover:text-primary transition-colors text-sm">Changelog</a></li>
              </ul>
            </div>

            <div className="footer-col opacity-0">
              <h3 className="text-white font-semibold mb-4">Resources</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-slate-400 hover:text-primary transition-colors text-sm">Blog</a></li>
                <li><a href="#" className="text-slate-400 hover:text-primary transition-colors text-sm">Help Center</a></li>
                <li><a href="#" className="text-slate-400 hover:text-primary transition-colors text-sm">Community</a></li>
                <li><a href="#" className="text-slate-400 hover:text-primary transition-colors text-sm">Guides</a></li>
              </ul>
            </div>

            <div className="footer-col opacity-0 col-span-2 sm:col-span-1">
              <h3 className="text-white font-semibold mb-4">Legal</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-slate-400 hover:text-primary transition-colors text-sm">Privacy Policy</a></li>
                <li><a href="#" className="text-slate-400 hover:text-primary transition-colors text-sm">Terms of Service</a></li>
                <li><a href="#" className="text-slate-400 hover:text-primary transition-colors text-sm">Cookie Policy</a></li>
                <li><a href="#" className="text-slate-400 hover:text-primary transition-colors text-sm">Security</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom opacity-0 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} StudyAI. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-slate-500 text-sm flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              All systems operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
