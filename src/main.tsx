import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'
import App from './App'
import Painel from './Painel'

const ehPainel = window.location.pathname.replace(/\/$/, '') === '/painel'

if (ehPainel) {
  document.documentElement.classList.add('m-enter-done')
  createRoot(document.getElementById('root')!).render(<StrictMode><Painel /></StrictMode>)
} else {
  // O kit de design espera header, main, footer e a barra do celular direto no <body>.
  document.getElementById('root')?.remove()
  createRoot(document.body).render(<StrictMode><App /></StrictMode>)
}
