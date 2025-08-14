import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import Routes from './routes'
import '@styles/index.css'


createRoot(document.getElementById('app')!)
  .render(
    <StrictMode>
      <Routes />
    </StrictMode>
  )
