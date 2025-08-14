import { defineTextStyles } from '@pandacss/dev'
import type { Tokens, SemanticTokens } from '@pandacss/dev'


export const tokens: Tokens = {
  colors: {
    bg: {
      DEFAULT: { value: '#D9D9D9' },
      rgb: { value: '217, 217, 217' },
    },

    fg: {
      DEFAULT: { value: '#545454' },
      rgb: { value: '84, 84, 84' },
      dark: { value: '#090909' }
    }
  },

  radii: { base: { value: '11px' } },

  sizes: {
    maxDocWidth: {
      value: '700px'
    }
  },

  fonts: {
    sans: { value: 'Ubuntu' }
  },
  fontSizes: {
    sm: { value: '12px' },
    md: { value: '14px' },
    base: { value: '16px' },
    lg: { value: '24px' },
    xlg: { value: '32px' }
  },
  fontWeights: {
    extralight: { value: '200' },
    light: { value: '300' },
    regular: { value: '400' },
    medium: { value: '500' },
    bold: { value: '600' },
    extrabold: { value: '700' },
    thick: { value: '800' },
  }
}

export const semanticTokens: SemanticTokens = {
  colors: {
    fonts: {
      base: { value: '{fonts.sans}' }
    },
    border: {
      DEFAULT: { value: '{colors.fg}' }
    }
  }
}

export const textStyles = defineTextStyles({
  bodyMd: {
    description: '',
    value: {
      fontFamily: 'sans',
      fontWeight: '400',
      fontSize: 'md',
      textDecoration: 'none',
    }
  },

  body: {
    description: '',
    value: {
      fontFamily: 'sans',
      fontWeight: '400',
      fontSize: 'base'
    }
  },

  titleLg: {
    description: '',
    value: {
      fontFamily: 'sans',
      fontWeight: 'medium',
      fontSize: 'xlg'
    }
  },
})

