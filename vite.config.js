import { resolve }from 'path'
import { cwd } from 'process'
import { defineConfig } from 'vite'

import react from '@vitejs/plugin-react'

import pkg from './package.json'

const HOST = pkg.env?.HOST
const path = p => resolve(cwd(), p)

export default defineConfig({
  plugins: [ react({ jsxRuntime: 'classic' }) ],

  resolve: {
    extensions: [ 'js', 'jsx', 'json', 'scss', 'css' ],
    alias: {
      'app': path('app'),
      'containers': path('app/containers'),
      'components': path('app/components'),
      'layouts': path('app/layouts'),
      'pages': path('app/pages'),

      'database': path('app/database'),
      'collections': path('app/database/collections'),
      'seeds': path('app/database/seeds'),
      'storage': path('app/storage'),

      '@store': path('app/store'),
      'reducers': path('app/reducers'),
      'actions': path('app/actions'),
      'sagas': path('app/sagas'),

      'styles': path('app/styles'),
      'config': path('app/config'),
      'utils': path('app/utils')
    }
  },

  server: {
    port: pkg.env?.PORT || 3000,
    strictPort: true,

    host: HOST || false,
    hmr: !HOST ? undefined : {
      protocol: "ws",
      host: HOST,
      port: pkg.env?.WS || 3001,
    },

    watch: {
      ignored: ["**/src-tauri/**"],
    },
  },
})
