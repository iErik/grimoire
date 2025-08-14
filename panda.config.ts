import {
  defineConfig,
} from '@pandacss/dev'

import { globalCss, globalFontface } from '@styles/global'
import { utilities } from '@styles/utilities'
import {
  tokens,
  textStyles,
  semanticTokens
} from '@styles/tokens'


export default defineConfig({
  // Whether to use css reset
  preflight: false,
  strictPropertyValues: true,

  include: [ './app/**/*.{js,jsx,ts,tsx}' ],
  exclude: [],

  theme: { tokens, semanticTokens, textStyles },

  utilities: { extend: utilities },

  globalFontface,
  globalCss,

  // The output directory for your css system
  outdir: 'styled-system',
});
