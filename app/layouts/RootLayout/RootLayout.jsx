import { remote } from 'electron';
import React from 'react';
import ui from 'redux-ui';
import os from 'os';

import { Switch, Route, Redirect } from 'react-router-dom';

import DashboardLayout from 'containers/layouts/DashboardLayout';
import EditorLayout from 'containers/layouts/EditorLayout';

@ui({
  state: {
    currentWindow: () => { return remote.getCurrentWindow(); }
  }
})
export default class RootLayout extends React.Component {
  render() {
    let platform = os.platform();

    return (
      <div className={`root-container ${ platform } theme-${this.props.appTheme}`}>
        <Switch>
          <Route path="/dashboard" component={ DashboardLayout } />
          <Route exact path="/editor/:notebookId/:noteId" component={ EditorLayout } />
          <Redirect to="/dashboard" />
        </Switch>
      </div>
    );
  }
}
