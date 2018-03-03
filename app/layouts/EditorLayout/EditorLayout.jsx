import React from 'react';
import ui from 'redux-ui';
import { Route } from 'react-router-dom';

import toMarkdown from 'to-markdown';

import EditorPage from 'pages/EditorPage';

@ui({
  state: {
    mdContents: ({ selectedNote }) => toMarkdown(selectedNote.contents) || '',
    isDark: false,
    showSidebar: false,
    areThemesLoaded: false
  }
})
export default class EditorLayout extends React.Component {
  componentWillReceiveProps(nextProps) {
    if (this.props.selectedNote._id !== nextProps.selectedNote._id) {
      this.props.updateUI({
        mdContents: toMarkdown(nextProps.selectedNote.contents)
      });
    }
  }

  render() {
    let basePath = this.props.match.url;
    return (
      <main className="full container">
        <Route path={basePath} render={(props) => <EditorPage { ...this.props } />} />
      </main>
    );
  }
}
