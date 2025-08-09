import {
  type RouteObject,
  createBrowserRouter
} from 'react-router'

import RootLayout from '@layouts/RootLayout'

import DummyPage from '@views/Dummy'

export const routes: RouteObject[] = [
  {
    Component: RootLayout,
    children: [
      {
        path: '/',
        Component: DummyPage
      }
    ]
  }
]

export const browserRouter = createBrowserRouter(routes)
