import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import SignupFlow from './pages/SignupFlow'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SignupFlow />
  </StrictMode>
)
