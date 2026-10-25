import React from 'react'
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
    mdContents: ({ editedNote }) =>
      toMarkdown(editedNote.contents) || '',
    isDark: false,
    showSidebar: false,
    areThemesLoaded: false
  }
})
export default class EditorLayout extends React.Component {
  static propTypes = {
    match: routePropTypes.match,
    updateUI: uiPropTypes.updateUI,
    // Optional: undefined when the edited note no longer exists.
    editedNote: noteShape
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.editedNote._id !== nextProps.editedNote._id) {
      this.props.updateUI({
        mdContents: toMarkdown(nextProps.editedNote.contents)
      })
    }
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
