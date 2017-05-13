const initialState = {
  runInitialSetup: undefined,
  appTheme: undefined,
  editorFontSize: undefined,
  editorFontFamily: undefined,
  editorTheme: undefined,
};

export default function settingsReducer(state = initialState, { type, payload }) {
  switch (type) {
    case 'UPDATE_SETTINGS_KEYPATH_FULFILLED':
      return payload;

    default:
      return state;
  }
}
