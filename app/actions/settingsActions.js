export const changeApplicationTheme = (value) => ({
  type: 'REQUEST_UPDATE_SETTINGS_KEYPATH',
  payload: {
    keyPath: 'appTheme',
    value,
  }
})

export const changeEditorFontSize = (value) => ({
  type: 'REQUEST_UPDATE_SETTINGS_KEYPATH',
  payload: {
    keyPath: 'editorFontSize',
    value: parseInt(value),
  }
})

export const changeEditorFontFamily = (value) => ({
  type: 'REQUEST_UPDATE_SETTINGS_KEYPATH',
  payload: {
    keyPath: 'editorFontFamily',
    value,
  }
})

export const changeEditorThemeLight = (value) => ({
  type: 'REQUEST_UPDATE_SETTINGS_KEYPATH',
  payload: {
    keyPath: 'editorTheme.light',
    value,
  }
})

export const changeEditorThemeDark = (value) => ({
  type: 'REQUEST_UPDATE_SETTINGS_KEYPATH',
  payload: {
    keyPath: 'editorTheme.dark',
    value,
  }
})

export const updateSettingsKeypathPending = (payload) => ({
  type: 'UPDATE_SETTINGS_KEYPATH_PENDING',
  payload,
})

export const updateSettingsKeypathFulfilled = (payload) => ({
  type: 'UPDATE_SETTINGS_KEYPATH_FULFILLED',
  payload,
})

export const updateSettingsKeypathRejected = (error) => ({
  type: 'UPDATE_SETTINGS_KEYPATH_REJECTED',
  payload: error
})
