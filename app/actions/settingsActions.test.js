import { describe, it, expect } from 'vitest'

import * as actions from 'actions/settingsActions'

const UPDATE = 'REQUEST_UPDATE_SETTINGS_KEYPATH'

describe('settingsActions', () => {
  it.each([
    ['changeApplicationTheme', 'appTheme', 'aurora'],
    ['changeEditorFontFamily', 'editorFontFamily', 'Fira Code'],
    ['changeEditorThemeLight', 'editorTheme.light', 'github'],
    ['changeEditorThemeDark', 'editorTheme.dark', 'monokai']
  ])('%s requests an update of %s', (name, keyPath, value) => {
    expect(actions[name](value)).toEqual({
      type: UPDATE,
      payload: { keyPath, value }
    })
  })

  it('changeEditorFontSize parses the size as an integer', () => {
    expect(actions.changeEditorFontSize('14px')).toEqual({
      type: UPDATE,
      payload: { keyPath: 'editorFontSize', value: 14 }
    })
    expect(actions.changeEditorFontSize(16).payload.value).toBe(16)
  })

  it('changeEditorFontSize yields NaN for a non-numeric size', () => {
    expect(actions.changeEditorFontSize('large').payload.value)
      .toBeNaN()
  })

  it.each([
    [
      'updateSettingsKeypathPending',
      'UPDATE_SETTINGS_KEYPATH_PENDING',
      { keyPath: 'appTheme', value: 'aurora' }
    ],
    [
      'updateSettingsKeypathFulfilled',
      'UPDATE_SETTINGS_KEYPATH_FULFILLED',
      { appTheme: 'aurora', editorFontSize: 14 }
    ],
    [
      'updateSettingsKeypathRejected',
      'UPDATE_SETTINGS_KEYPATH_REJECTED',
      new Error('boom')
    ]
  ])('%s creates a %s action', (name, type, arg) => {
    expect(actions[name](arg)).toEqual({ type, payload: arg })
  })
})
