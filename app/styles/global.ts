import { defineGlobalStyles } from '@pandacss/dev'
import type { GlobalFontface } from '@pandacss/types'

export const globalFontface: GlobalFontface = {
  Ubuntu: [
    {
      src: [
        'url(/fonts/UbuntuSans-Variable.woff2)',
        'format(woff2)'
      ].join(' '),
      fontWeight: '100 800',
      fontStyle: 'normal'
    },
    {
      src: [
        'url(/fonts/UbuntuSans-Variable.woff2)',
        'format(woff2)'
      ].join(' '),
      fontWeight: '100 800',
      fontStyle: 'italic'
    }
  ]
}

export const globalCss = defineGlobalStyles({
  'html, body, #app': {
    height: '100vh',
    width: '100vw',

    color: 'fg',
    fontFamily: 'base',
    backgroundColor: 'bg'
  },

  'html': {
    _motionSafe: { interpolateSize: 'allow-keywords' }
  },

  '*, *::before, *::after': {
    boxSizing: 'border-box',
    borderColor: 'border',
    '-webkit-font-smoothing': 'antialiased'
  },

})

