import { useState } from 'react';;
import { Menu, User as UserIcon } from 'lucide-react';
import Sidebar from '../components/sidebar'
import { useAuth } from '../context/AuthContext';
import { ModeToggle } from '../components/theme-toggler';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-background font-sans flex text-foreground">
      {/* Sidebar Component */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden bg-muted/30">
        {/* Topbar */}
        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6 lg:px-10 shrink-0">
          <div className="flex items-center">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 -ml-2 mr-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative p-2 text-muted-foreground hover:text-foreground transition-colors">
              <ModeToggle />
            </div>
            
            <div className="flex items-center gap-4 pl-6 border-l border-border">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-primary-foreground shadow-sm">
                { user ? (
                  <img src={user.profileImage} alt="User" className="w-10 h-10 rounded-xl" />
                ) : (
                  <UserIcon className="w-5 h-5" />
                )}
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-bold leading-none mb-1.5">{user?.username || 'User'}</p>
                <p className="text-xs text-muted-foreground leading-none">{user?.email || 'user@example.com'}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-10">
          {children}
        </div>
      </main>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}
