import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { runStorageCleanup  } from './services/draftsService';
import './index.css'
import App from './App.jsx'
import { registerSW } from 'virtual:pwa-register'

import './styles/variables.css';
import './styles/global.css';
import './styles/layout.css';
import './styles/forms.css';
import './styles/buttons.css';
import './styles/tables.css';
import './styles/mobile.css';

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