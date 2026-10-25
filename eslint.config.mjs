import js from '@eslint/js'
import stylistic from '@stylistic/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import react from 'eslint-plugin-react'
import globals from 'globals'

// @typescript-eslint/parser parses the legacy `@ui({...})` class
// decorators that espree rejects. It runs without type information
// and no TypeScript rules are enabled.
const parserOptions = {
  ecmaVersion: 'latest',
  ecmaFeatures: { jsx: true }
}

const formatting = {
  plugins: { '@stylistic': stylistic },
  rules: {
    '@stylistic/semi': ['error', 'never'],
    '@stylistic/quotes': ['error', 'single', { avoidEscape: true }],
    '@stylistic/jsx-quotes': ['error', 'prefer-double'],
    '@stylistic/indent': ['error', 2, { SwitchCase: 1 }],
    '@stylistic/comma-style': ['error', 'last'],
    '@stylistic/max-len': ['error', {
      code: 70,
      tabWidth: 2,
      ignoreUrls: true
    }]
  }
}

const testFiles = ['**/*.test.js']

export default [
  {
    ignores: [
      'node_modules/',
      'app/node_modules/',
      'app/main.js',
      'app/app.html',
      'app/assets/',
      'release/'
    ]
  },
  {
    linterOptions: { reportUnusedDisableDirectives: 'error' },
    languageOptions: {
      parser: tsParser,
      parserOptions
    }
  },
  formatting,

  // Renderer: runs with nodeIntegration, so both browser and Node
  // globals are available.
  {
    files: ['app/**/*.{js,jsx}'],
    ignores: ['app/main.dev.js', ...testFiles],
    ...js.configs.recommended,
    ...react.configs.flat.recommended,
    languageOptions: {
      ...react.configs.flat.recommended.languageOptions,
      parser: tsParser,
      parserOptions,
      sourceType: 'module',
      globals: { ...globals.browser, ...globals.node }
    },
    settings: { react: { version: '16.2' } },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.flat.recommended.rules
    }
  },

  // Electron main process.
  {
    files: ['app/main.dev.js'],
    ...js.configs.recommended,
    languageOptions: {
      sourceType: 'module',
      globals: globals.node
    }
  },

  // Dev bootstrap and any other CommonJS entry.
  {
    files: ['**/*.cjs'],
    ...js.configs.recommended,
    languageOptions: {
      sourceType: 'commonjs',
      globals: globals.node
    }
  },

  // Build scripts, env config and this file.
  {
    files: ['build/**/*.js', 'config/**/*.js', 'eslint.config.mjs'],
    ...js.configs.recommended,
    languageOptions: {
      sourceType: 'module',
      globals: globals.node
    }
  },

  // Tests import their Vitest globals from 'vitest'.
  {
    files: testFiles,
    ...js.configs.recommended,
    languageOptions: {
      sourceType: 'module',
      globals: globals.node
    }
  }
]
