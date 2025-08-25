import { resolve } from 'path'
import { cwd } from 'process'
import { watch } from 'fs'
import { build } from 'vite'

import externalize from 'vite-plugin-externalize-dependencies'

const ROOT_DIR = cwd()
const APP_DIR = resolve(ROOT_DIR, 'app')

const ELECTRON_ENTRY = resolve(APP_DIR, 'main.dev.js')
const path = p => resolve(cwd(), p)

console.log({ ROOT_DIR })

const buildElectron = () => build({
  root: ROOT_DIR,

  build: {
    target: 'node22',
    lib: {
      entry: [ ELECTRON_ENTRY ],
      filename: 'main.js',
      name: 'main.js',
      formats: [ 'es' ]
    },
    rollupOptions: {
      external: [
        'url',
        'fs',
        'path',
        'os',
        'process',
        'electron',
//        'fs-extra',
//        'nedb',
//        'bluebird',
//        'electron-settings'
      ]
    }
  },

  resolve: {
    extensions: [ '.js', '.jsx', '.json', '.scss', '.css' ],
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

      'store': path('app/store'),
      'reducers': path('app/reducers'),
      'actions': path('app/actions'),
      'sagas': path('app/sagas'),

      'styles': path('app/styles'),
      'config': path('app/config'),
      'utils': path('app/utils')
    }
  },

})

buildElectron()
