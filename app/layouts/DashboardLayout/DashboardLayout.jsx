import React from 'react';
import ui from 'redux-ui';

import { Switch, Route } from 'react-router-dom';

import Sidebar from './components/Sidebar';
import NotebooksPage from 'pages/NotebooksPage';
import SettingsPage from 'pages/SettingsPage';
import NotesPage from 'pages/NotesPage';

@ui({
  state: {
    showSidebar: false,
  }
})
export default class DashboardLayout extends React.Component {
  render() {
    let basePath = this.props.match.url;

    return (
      <div className="full container">
        <Sidebar { ...this.props } />

        <main className="inner container">
          <Switch>
            <Route
              exact
              path={`${basePath}/notebooks`}
              render={(props) => <NotebooksPage {...this.props} /> } />
            <Route
              exact
              path={`${basePath}/settings`}
              render={(props) => <SettingsPage {...this.props} /> } />
            <Route
              exact
              path={`${basePath}`}
              render={(props) => <NotesPage {...this.props} /> } />
          </Switch>
        </main>
      </div>
    );
  }
}
