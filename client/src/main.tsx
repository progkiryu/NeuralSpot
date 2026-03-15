import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './main.css'

export const DBLink = import.meta.env.MODE === "development" ? 
  import.meta.env.VITE_DEV_ADDR : import.meta.env.VITE_PROD_ADDR;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
