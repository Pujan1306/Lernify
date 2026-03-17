import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FileText, BookOpen, User, LogOut, BrainCircuit, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const {logout} = useAuth()
  return (
    <aside 
      className={`fixed md:relative inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transition-all duration-300 ease-in-out flex flex-col ${
        isOpen ? 'translate-x-0' : '-translate-x-full md:-ml-64'
      }`}
    >
      {/* Sidebar Header */}
      <div className="h-16 flex items-center justify-between px-6 border-b border-border shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-sm">
            <BrainCircuit className="w-6 h-6 text-primary-foreground" />
          </div>
          <span className="font-bold text-sm tracking-tight">AI Learning Assistant</span>
        </div>
        <button 
          onClick={() => setIsOpen(false)}
          className="md:hidden p-1 text-muted-foreground hover:text-foreground"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Sidebar Links */}
      <div className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
        <NavLink 
          to="/dashboard" 
          className={({ isActive }) => 
            `flex items-center gap-3 px-4 py-3 rounded-2xl font-medium text-sm transition-colors ${
              isActive 
                ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20 font-semibold' 
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`
          }
        >
          <LayoutDashboard className="w-5 h-5" />
          Dashboard
        </NavLink>
        <NavLink 
          to="/documents" 
          className={({ isActive }) => 
            `flex items-center gap-3 px-4 py-3 rounded-2xl font-medium text-sm transition-colors ${
              isActive 
                ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20 font-semibold' 
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`
          }
        >
          <FileText className="w-5 h-5" />
          Documents
        </NavLink>
        <NavLink 
          to="/flashcards" 
          className={({ isActive }) => 
            `flex items-center gap-3 px-4 py-3 rounded-2xl font-medium text-sm transition-colors ${
              isActive 
                ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20 font-semibold' 
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`
          }
        >
          <BookOpen className="w-5 h-5" />
          Flashcards
        </NavLink>
        <NavLink 
          to="/profile" 
          className={({ isActive }) => 
            `flex items-center gap-3 px-4 py-3 rounded-2xl font-medium text-sm transition-colors ${
              isActive 
                ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20 font-semibold' 
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`
          }
        >
          <User className="w-5 h-5" />
          Profile
        </NavLink>
      </div>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-border">
        <button onClick={logout} className="w-full flex items-center hover:text-red-600 gap-3 px-4 py-3 text-muted-foreground hover:bg-muted rounded-2xl font-medium text-sm transition-colors">
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>
  );
}
