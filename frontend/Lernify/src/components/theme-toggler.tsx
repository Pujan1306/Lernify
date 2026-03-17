"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "./theme-provider"

export function ModeToggle() {
  const { mode, setMode } = useTheme()

  const modeOptions = [
    { id: 'light' as const, icon: Sun, label: 'Light', color: 'text-amber-500' },
    { id: 'dark' as const, icon: Moon, label: 'Dark', color: 'text-indigo-400' },
  ]

  const currentMode = mode || 'light'
  
  return (
    <div className="flex p-1 bg-zinc-100/80 dark:bg-zinc-900/80 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 rounded-full w-fit transition-all shadow-inner">
      {modeOptions.map((opt) => {
        const Icon = opt.icon
        const isActive = currentMode === opt.id
        
        return (
          <button
            key={opt.id}
            onClick={() => setMode(opt.id)}
            className={`
              relative flex items-center justify-center h-8 w-8 sm:w-20 rounded-full transition-all duration-300
              ${isActive 
                ? "bg-white dark:bg-zinc-800 shadow-sm scale-100" 
                : "hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50 scale-95 opacity-60 hover:opacity-100"}
            `}
          >
            <Icon className={`h-4 w-4 ${isActive ? opt.color : "text-zinc-500"}`} />
            <span className={`hidden sm:block ml-2 text-xs font-medium ${isActive ? "text-zinc-900 dark:text-zinc-100" : "text-zinc-500"}`}>
              {opt.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}