import React from 'react';
import { X } from 'lucide-react';

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
}

export default function Dialog({ isOpen, onClose, title, subtitle, children, icon, maxWidth = 'md' }: DialogProps) {
  if (!isOpen) return null;

  const maxWidthClass = {
    'sm': 'max-w-sm',
    'md': 'max-w-md',
    'lg': 'max-w-lg',
    'xl': 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
  }[maxWidth];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className={`bg-card w-full ${maxWidthClass} rounded-4xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-8 flex-1 overflow-y-auto">
          <div className="flex justify-between items-start mb-2">
            <div className="flex flex-col gap-1.5">
              {icon && <div className="mb-3">{icon}</div>}
              {title && <h2 className="text-2xl font-bold tracking-tight">{title}</h2>}
              {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
            </div>
            <button 
              onClick={onClose} 
              className="text-muted-foreground hover:text-foreground p-2 rounded-full hover:bg-muted transition-colors -mr-2 -mt-2 shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
