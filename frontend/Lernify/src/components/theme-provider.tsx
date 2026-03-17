"use client"

import { createContext, useContext, useEffect, useState, useCallback } from "react"
import { themes, tokensToCssVars, type ThemeName, type ThemeMode, type ThemeTokens } from "../lib/themes"
import { authService } from "../services/authService"
import { sileo } from "sileo"

interface ThemeProviderProps {
  children: React.ReactNode
  defaultTheme?: ThemeName
  defaultMode?: ThemeMode
  storageKey?: string
}

interface ThemeProviderState {
  theme: ThemeName
  mode: ThemeMode
  activeTokens: ThemeTokens
  setTheme: (theme: ThemeName) => void
  setMode: (mode: ThemeMode) => void
  toggleMode: () => void
}

const DEFAULT_THEME: ThemeName = "theme1"
const DEFAULT_MODE: ThemeMode = "light"

const initialState: ThemeProviderState = {
  theme: DEFAULT_THEME,
  mode: DEFAULT_MODE,
  activeTokens: themes[DEFAULT_THEME][DEFAULT_MODE],
  setTheme: () => {},
  setMode: () => {},
  toggleMode: () => {},
}

const ThemeContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = DEFAULT_THEME,
  defaultMode = DEFAULT_MODE,
  storageKey = "app-theme",
}: ThemeProviderProps) {
  /* ---------------- THEME NAME ---------------- */

  const [theme, setThemeState] = useState<ThemeName>(() => {
    if (typeof window === "undefined") return defaultTheme

    const stored = localStorage.getItem(`${storageKey}-name`)

    if (!stored || !themes[stored as ThemeName]) {
      localStorage.setItem(`${storageKey}-name`, defaultTheme)
      return defaultTheme
    }

    return stored as ThemeName
  })

  /* ---------------- MODE ---------------- */

  const [mode, setModeState] = useState<ThemeMode>(() => {
    if (typeof window === "undefined") return defaultMode

    const stored = localStorage.getItem(`${storageKey}-mode`)

    if (stored !== "light" && stored !== "dark") {
      localStorage.setItem(`${storageKey}-mode`, defaultMode)
      return defaultMode
    }

    return stored
  })

  /* ---------------- TOKENS ---------------- */

  const activeTokens: ThemeTokens =
    themes[theme]?.[mode] ?? themes[DEFAULT_THEME][mode]

  /* ---------------- APPLY TO DOM ---------------- */

  const applyThemeToRoot = useCallback((tokens: ThemeTokens, currentMode: ThemeMode) => {
    const root = document.documentElement

    root.classList.remove("light", "dark")
    root.classList.add(currentMode)

    const cssVars = tokensToCssVars(tokens)
    for (const [key, value] of Object.entries(cssVars)) {
      root.style.setProperty(key, String(value))
    }
  }, [])

  useEffect(() => {
    applyThemeToRoot(activeTokens, mode)
  }, [activeTokens, mode, applyThemeToRoot])

  /* ---------------- ACTIONS ---------------- */

  const setTheme = useCallback(
    async (newTheme: ThemeName) => {
      if (!themes[newTheme]) {
        console.error("Blocked invalid theme:", newTheme)
        return
      }

      localStorage.setItem(`${storageKey}-name`, newTheme)
      setThemeState(newTheme)

      try {
        const res = await authService.updateTheme(newTheme)
        if (res?.success) {
          sileo.success({ title: res.message })
        }
      } catch (err) {
        sileo.error({
          title: err instanceof Error ? err.message : "Theme update failed",
        })
      }
    },
    [storageKey]
  )

  const setMode = useCallback(
    (newMode: ThemeMode) => {
      if (newMode !== "light" && newMode !== "dark") return

      localStorage.setItem(`${storageKey}-mode`, newMode)
      setModeState(newMode)
    },
    [storageKey]
  )

  const toggleMode = useCallback(() => {
    setMode(mode === "light" ? "dark" : "light")
  }, [mode, setMode])

  /* ---------------- CONTEXT ---------------- */

  const value: ThemeProviderState = {
    theme,
    mode,
    activeTokens,
    setTheme,
    setMode,
    toggleMode,
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

/* ---------------- HOOK ---------------- */

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider")
  return ctx
}

export type { ThemeName, ThemeMode, ThemeTokens }
