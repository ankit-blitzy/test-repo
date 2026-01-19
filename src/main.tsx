import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/styles/global.css'

// Placeholder App component - will be replaced by implementation agents
function App() {
  return (
    <div className="min-h-screen bg-amber-50 flex items-center justify-center">
      <h1 className="text-3xl font-bold text-amber-800">
        Burger Restaurant - Coming Soon
      </h1>
    </div>
  )
}

const rootElement = document.getElementById('root')
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>
  )
}
