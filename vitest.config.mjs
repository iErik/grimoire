import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

const root = path.dirname(fileURLToPath(import.meta.url))
const app = (dir = '') => path.resolve(root, 'app', dir)

// Keep these in sync with resolve.alias in
// build/webpack.base.config.js: same names, same targets.
const aliases = {
  'app': app(),
  'containers': app('containers'),
  'components': app('components'),
  'layouts': app('layouts'),
  'pages': app('pages'),

  'collections': app('database/collections'),
  'database': app('database'),
  'seeds': app('database/seeds'),
  'storage': app('storage'),

  'store': app('store'),
  'reducers': app('reducers'),
  'actions': app('actions'),
  'sagas': app('sagas'),

  'styles': app('styles'),
  'config': app('config'),
  'utils': app('utils')
}

export default defineConfig({
  resolve: {
    alias: aliases,
    // Guard: resolve every electron import to the root copy, so a
    // nested one (e.g. an auto-installed peer under app/) can't
    // bypass the stub in vitest.setup.js and download its binary.
    dedupe: ['electron']
  },
  test: {
    environment: 'node',
    include: ['app/**/*.test.js'],
    setupFiles: ['./vitest.setup.js']
  }
})
