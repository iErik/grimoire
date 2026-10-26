import PropTypes from 'prop-types'

// Shared prop-type definitions. Every field inside a shape is
// optional: "no note selected" and "no active notebook" are `{}`,
// and settings are empty until the initial state has loaded.

// nedb stores timestamps as Dates. They can reach a window as
// strings after crossing IPC.
const timestamp = PropTypes.oneOfType([
  PropTypes.instanceOf(Date),
  PropTypes.string
])

// A note, such as the selected note or an editor window's edited
// note.
export const noteShape = PropTypes.shape({
  _id: PropTypes.string,
  title: PropTypes.string,
  contents: PropTypes.string,
  notebookId: PropTypes.string,
  createdAt: timestamp,
  updatedAt: timestamp
})

// A notebook, such as the active notebook.
export const notebookShape = PropTypes.shape({
  _id: PropTypes.string,
  name: PropTypes.string,
  createdAt: timestamp,
  updatedAt: timestamp
})

// The editor themes chosen for light and dark mode.
const editorThemeShape = PropTypes.shape({
  name: PropTypes.string,
  label: PropTypes.string
})

export const editorThemesShape = PropTypes.shape({
  light: editorThemeShape,
  dark: editorThemeShape
})

// The settings the settings page reads.
export const settingsShape = PropTypes.shape({
  appTheme: PropTypes.string,
  editorFontSize: PropTypes.number,
  editorTheme: editorThemesShape
})

// Reference the injected props below by key (`ui: uiPropTypes.ui`)
// instead of spreading them in: react/prop-types can't resolve an
// imported spread, so it skips checking that component.

// Injected by redux-ui's `@ui` decorator, and passed on to children
// through `{ ...props }`.
export const uiPropTypes = {
  ui: PropTypes.object.isRequired,
  updateUI: PropTypes.func.isRequired
}

// Injected by react-router into routed components and by its
// `withRouter` decorator, and passed on to children through
// `{ ...props }`.
export const routePropTypes = {
  match: PropTypes.shape({
    url: PropTypes.string,
    params: PropTypes.objectOf(PropTypes.string)
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
    replace: PropTypes.func
  }).isRequired
}
