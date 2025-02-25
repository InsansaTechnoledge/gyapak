import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { HelmetProvider } from "react-helmet-async";
import { ApiProvider } from './Context/ApiContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <ApiProvider>
        <App />
      </ApiProvider>
    </HelmetProvider>
  </StrictMode>,
)
