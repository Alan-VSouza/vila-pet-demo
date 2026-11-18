import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'
import App from './App'
import Painel from './Painel'

const ehPainel = window.location.pathname.replace(/\/$/, '') === '/painel'

createRoot(document.getElementById('root')!).render(<StrictMode>{ehPainel ? <Painel /> : <App />}</StrictMode>)
