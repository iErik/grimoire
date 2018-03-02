import React from 'react';
import ui from 'redux-ui';

import { Route } from 'react-router-dom';

import EditorPage from 'pages/EditorPage';

@ui({
  state: {
    isDark: false,
    showSidebar: false,
    areThemesLoaded: false
  }
})
export default class EditorLayout extends React.Component {
  render() {
    let basePath = this.props.match.url;
    return (
      <main className="full container">
        <Route path={basePath} render={(props) => <EditorPage { ...this.props } />} />
      </main>
    );
  }
}
