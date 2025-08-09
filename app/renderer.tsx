import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { RouterProvider } from 'react-router'

import { browserRouter } from './routes'


createRoot(document.getElementById('app')!)
  .render(
    <StrictMode>
      <RouterProvider router={browserRouter} />
    </StrictMode>
  )
