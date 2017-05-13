import React from 'react';
import { Route, IndexRoute, IndexRedirect } from 'react-router';

import RootLayout from 'containers/layouts/RootLayout';
import DashboardLayout from 'containers/layouts/DashboardLayout';
import EditorLayout from 'containers/layouts/EditorLayout';

import NotesPage from 'pages/NotesPage';
import NotebooksPage from 'pages/NotebooksPage';
import SettingsPage from 'pages/SettingsPage';
import EditorPage from 'pages/EditorPage'

export default (
  <Route path="/" component={ RootLayout }>
    <IndexRedirect to="dashboard" />

    <Route path="dashboard" component={ DashboardLayout }>
      <IndexRoute component={ NotesPage } />
      <Route path="notebooks" component={ NotebooksPage } />
      <Route path="settings" component={ SettingsPage } />
    </Route>

    <Route path="editor/:notebookId/:noteId" component={ EditorLayout }>
      <IndexRoute component={ EditorPage } />
    </Route>
  </Route>
);
