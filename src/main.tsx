import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { useAuthStore } from './store/slices/authSlice.ts'; // 👈 Import the store

// 👇 Call the hydrate action right away
useAuthStore.getState().hydrateAuth();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
