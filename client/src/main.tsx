import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './main.css'

export const isDev: boolean = import.meta.env.MODE === "development";
let apiLink: string = import.meta.env.VITE_API_ADDR;
if (isDev) apiLink = "http://localhost:5000";
export const DBLink: string = apiLink;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)