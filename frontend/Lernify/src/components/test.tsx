import { useTheme } from "./theme-provider"

export function MyComponent() {
  const { theme, mode, setTheme, setMode, toggleMode } = useTheme()
  
  return (
    <div>
      <p>Current theme: {theme}</p>
      <p>Current mode: {mode}</p>
      
      <button onClick={() => setTheme('theme2')}>
        Switch to Theme 2
      </button>
      
      <button onClick={() => setMode('dark')}>
        Switch to Dark Mode
      </button>
      
      <button onClick={toggleMode}>
        Toggle Light/Dark
      </button>
    </div>
  )
}