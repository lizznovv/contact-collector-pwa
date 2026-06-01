import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { runStorageCleanup  } from './services/draftsService';
import './index.css'
import App from './App.jsx'

import { registerSW } from 'virtual:pwa-register'
registerSW({ immediate: true })

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
runStorageCleanup();

setInterval(() => {
    runStorageCleanup();
}, 24 * 60 * 60 * 1000);