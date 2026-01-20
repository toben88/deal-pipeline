import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import TestConnection from './TestConnection.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <TestConnection />
  </StrictMode>,
)
