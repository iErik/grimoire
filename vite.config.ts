import { defineConfig } from 'vite'

import tsconfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

import pkg from './package.json'


const HOST = pkg.env?.HOST
const PORT = pkg.env?.PORT || 3000
const WS   = pkg.env?.WS || 3001   // WebSocket port


export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    tsconfigPaths()
  ],

  resolve: { },

  server: {
    port: PORT,
    strictPort: true,

    host: HOST || false,
    hmr: !HOST ? undefined : {
      protocol: "ws",
      host: HOST,
      port: WS,
    },
  },
});
