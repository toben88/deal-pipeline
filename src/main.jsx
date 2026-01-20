import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import TestConnection from './TestConnection.jsx'

// Use ?test in URL to show test page, otherwise show main app
const showTest = window.location.search.includes('test')

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {showTest ? <TestConnection /> : <App />}
  </StrictMode>,
)
