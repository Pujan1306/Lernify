import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { 
  Brain, 
  LayoutDashboard, 
  FileText, 
  Layers, 
  User, 
  LogOut, 
  Menu, 
  Sun, 
  Moon, 
  ArrowLeft, 
  Trophy,
  Play,
  Plus 
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function Dashboard() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none reverse"
      }
    });

    tl.fromTo('.dashboard-header',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
    )
    .fromTo('.dashboard-mockup',
      { opacity: 0, y: 50, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 1, ease: 'power3.out' },
      "-=0.4"
    );
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="relative z-10 bg-background py-16 px-6 md:px-12 border-t border-white/5">
      <div className="max-w-[1100px] mx-auto">
        <div className="dashboard-header mb-12 text-center opacity-0">
          <h2 className="text-3xl md:text-4xl font-display uppercase tracking-wider mb-4 text-foreground">Learning Platform</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm">
            Experience our next-generation AI learning assistant interface.
          </p>
        </div>

        {/* Dashboard Mockup */}
        <div className="dashboard-mockup opacity-0 rounded-2xl border border-border/50 shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px] md:h-[600px] ring-1 ring-white/5 font-sans text-slate-300 bg-[#171b26]">
          
          {/* Sidebar */}
          <aside className="w-56 bg-[#171b26] border-r border-white/10 hidden md:flex flex-col">
            <div className="h-14 flex items-center px-5 border-b border-white/10">
              <div className="flex items-center gap-3 text-white font-semibold text-sm">
                <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center text-[#171b26]">
                  <Brain size={16} />
                </div>
                <span>AI Assistant</span>
              </div>
            </div>
            
            <nav className="p-3 flex flex-col gap-1.5 flex-1 mt-2">
              <div className="flex items-center gap-3 px-3 py-2.5 text-slate-400 hover:text-slate-200 hover:bg-white/5 rounded-xl transition-colors cursor-pointer text-sm">
                <LayoutDashboard size={18} />
                <span className="font-medium">Dashboard</span>
              </div>
              <div className="flex items-center gap-3 px-3 py-2.5 bg-primary text-[#171b26] rounded-xl cursor-pointer shadow-sm text-sm">
                <FileText size={18} />
                <span className="font-semibold">Documents</span>
              </div>
              <div className="flex items-center gap-3 px-3 py-2.5 text-slate-400 hover:text-slate-200 hover:bg-white/5 rounded-xl transition-colors cursor-pointer text-sm">
                <Layers size={18} />
                <span className="font-medium">Flashcards</span>
              </div>
              <div className="flex items-center gap-3 px-3 py-2.5 text-slate-400 hover:text-slate-200 hover:bg-white/5 rounded-xl transition-colors cursor-pointer text-sm">
                <User size={18} />
                <span className="font-medium">Profile</span>
              </div>
            </nav>
            
            <div className="p-3 border-t border-white/10">
              <div className="flex items-center gap-3 px-3 py-2.5 text-slate-400 hover:text-slate-200 hover:bg-white/5 rounded-xl transition-colors cursor-pointer text-sm">
                <LogOut size={18} />
                <span className="font-medium">Logout</span>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 flex flex-col min-w-0 bg-[#1a1f2b]">
            {/* Header */}
            <header className="h-14 border-b border-white/10 flex items-center justify-between px-5 bg-[#171b26]">
              <button className="text-slate-400 hover:text-slate-200 transition-colors">
                <Menu size={20} />
              </button>
              
              <div className="flex items-center gap-5">
                {/* Theme Toggle */}
                <div className="flex items-center bg-[#0f1219] rounded-full p-1 border border-white/5 hidden sm:flex">
                  <button className="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors">
                    <Sun size={12} />
                    <span>Light</span>
                  </button>
                  <button className="flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-[#1e2433] text-white shadow-sm border border-white/5">
                    <Moon size={12} />
                    <span>Dark</span>
                  </button>
                </div>
                
                {/* User Profile */}
                <div className="flex items-center gap-3 pl-5 border-l border-white/10">
                  <img 
                    src="https://picsum.photos/seed/alex/100/100" 
                    alt="Alex Chen" 
                    className="w-8 h-8 rounded-full object-cover border border-white/10"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex flex-col hidden sm:flex">
                    <span className="text-sm font-semibold text-white leading-tight">Alex Chen</span>
                    <span className="text-[10px] text-slate-400">alex.chen@example.com</span>
                  </div>
                </div>
              </div>
            </header>

            {/* Content Area */}
            <div className="p-4 md:p-6 flex-1 overflow-y-auto">
              <button className="flex items-center gap-2 text-slate-400 hover:text-slate-200 transition-colors text-xs font-medium mb-5">
                <ArrowLeft size={14} />
                Back to Documents
              </button>
              
              <h1 className="text-2xl font-bold text-white mb-6">Machine Learning Basics.pdf</h1>
              
              {/* Tabs */}
              <div className="flex items-center gap-6 border-b border-white/10 mb-6 overflow-x-auto scrollbar-hide">
                {['Content', 'Chat', 'AI Actions', 'Flashcards'].map((tab) => (
                  <button key={tab} className="pb-3 text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors whitespace-nowrap">
                    {tab}
                  </button>
                ))}
                <button className="pb-3 text-xs font-medium text-primary border-b-2 border-primary whitespace-nowrap">
                  Quizzes
                </button>
              </div>

              {/* Quizzes Section */}
              <div className="bg-[#171b26] border border-white/5 rounded-2xl p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-lg font-bold text-white mb-1">Your Quizzes</h2>
                    <p className="text-xs text-slate-400">2 quizzes available</p>
                  </div>
                  <button className="flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-[#171b26] px-4 py-2 rounded-xl text-sm font-semibold transition-colors">
                    <Plus size={16} />
                    Generate Quiz
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Quiz Card 1 */}
                  <div className="bg-[#1e2433] border border-white/5 rounded-2xl p-5 flex flex-col">
                    <div className="flex items-start justify-between mb-4">
                      <div className="bg-primary/10 text-primary border border-primary/20 px-2.5 py-1 rounded-lg flex items-center gap-1.5 text-[10px] font-bold">
                        <Trophy size={12} />
                        Score: 85
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-bold text-white mb-1.5">Neural Networks Quiz</h3>
                    <p className="text-[10px] text-slate-400 font-medium mb-5 uppercase tracking-wider">Created 10/12/2025</p>
                    
                    <div className="mb-6">
                      <span className="inline-block border border-white/10 text-slate-300 text-[10px] font-medium px-2.5 py-1 rounded-lg">
                        12 Questions
                      </span>
                    </div>
                    
                    <button className="mt-auto w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-[#171b26] py-2.5 rounded-xl text-sm font-bold transition-colors">
                      <Play size={16} className="fill-current" />
                      Review Quiz
                    </button>
                  </div>

                  {/* Quiz Card 2 */}
                  <div className="bg-[#1e2433] border border-white/5 rounded-2xl p-5 flex flex-col">
                    <div className="flex items-start justify-between mb-4">
                      <div className="bg-primary/10 text-primary border border-primary/20 px-2.5 py-1 rounded-lg flex items-center gap-1.5 text-[10px] font-bold">
                        <Trophy size={12} />
                        Score: 0
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-bold text-white mb-1.5">Gradient Descent Practice</h3>
                    <p className="text-[10px] text-slate-400 font-medium mb-5 uppercase tracking-wider">Created 10/14/2025</p>
                    
                    <div className="mb-6">
                      <span className="inline-block border border-white/10 text-slate-300 text-[10px] font-medium px-2.5 py-1 rounded-lg">
                        8 Questions
                      </span>
                    </div>
                    
                    <button className="mt-auto w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-[#171b26] py-2.5 rounded-xl text-sm font-bold transition-colors">
                      <Play size={16} className="fill-current" />
                      Start Quiz
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
