import { describe, it, expect } from 'vitest'

import settingsReducer from 'reducers/settingsReducer'

describe('settingsReducer', () => {
  it('starts with every setting undefined', () => {
    const state = settingsReducer(undefined, { type: '@@INIT' })

    expect(state).toStrictEqual({
      runInitialSetup: undefined,
      appTheme: undefined,
      editorFontSize: undefined,
      editorFontFamily: undefined,
      editorTheme: undefined
    })
  })

  it('returns the same state for an unknown action', () => {
    const state = Object.freeze({ appTheme: 'aurora' })

    expect(settingsReducer(state, { type: 'UNKNOWN', payload: {} }))
      .toBe(state)
  })

  it('takes the payload on UPDATE_SETTINGS_KEYPATH_FULFILLED', () => {
    const state = Object.freeze({ appTheme: 'aurora' })
    const settings = {
      runInitialSetup: false,
      appTheme: 'aurora',
      editorFontSize: 14,
      editorFontFamily: 'Fira Code',
      editorTheme: { light: 'github', dark: 'monokai' }
    }

    expect(settingsReducer(state, {
      type: 'UPDATE_SETTINGS_KEYPATH_FULFILLED',
      payload: settings
    })).toBe(settings)
  })
})
