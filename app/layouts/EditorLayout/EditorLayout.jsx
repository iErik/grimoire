import React from 'react'
import PropTypes from 'prop-types'
import {
  noteShape,
  uiPropTypes,
  routePropTypes
} from 'utils/propShapes'
import ui from 'redux-ui'
import { Route } from 'react-router-dom'

import toMarkdown from 'to-markdown'

import EditorPage from 'pages/EditorPage'

@ui({
  state: {
    mdContents: ({ editedNote }) => editedNote
      ? toMarkdown(editedNote.contents) || ''
      : '',
    isDark: false,
    showSidebar: false,
    areThemesLoaded: false
  }
})
export default class EditorLayout extends React.Component {
  static propTypes = {
    match: routePropTypes.match,
    history: routePropTypes.history,
    ui: uiPropTypes.ui,
    updateUI: uiPropTypes.updateUI,
    // Optional: undefined when the edited note no longer exists.
    editedNote: noteShape,
    // Set only while the edited note is missing: the note to
    // switch to, or undefined to close the window.
    nextNote: noteShape,
    isStoreLoading: PropTypes.bool.isRequired
  }

  componentDidMount() {
    this.replaceMissingNote(this.props)
  }

  componentWillReceiveProps(nextProps) {
    const { editedNote } = nextProps

    if (!editedNote) return this.replaceMissingNote(nextProps)

    if (!this.props.editedNote ||
        this.props.editedNote._id !== editedNote._id) {
      this.props.updateUI({
        mdContents: toMarkdown(editedNote.contents)
      })
    }
  }

  // When the edited note doesn't exist (deleted, or never there),
  // switch to the notebook's newest note, or close the window if
  // the notebook is empty.
  replaceMissingNote({ editedNote, nextNote, isStoreLoading }) {
    if (editedNote || isStoreLoading) return

    if (!nextNote) return this.props.ui.currentWindow.close()

    const { notebookId } = this.props.match.params
    this.props.history.replace(
      `/editor/${notebookId}/${nextNote._id}`)
  }

  render() {
    let basePath = this.props.match.url
    return (
      <main className="full container">
        <Route
          path={basePath}
          render={() => <EditorPage { ...this.props } />} />
      </main>
    )
  }
}
