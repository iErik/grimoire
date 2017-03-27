import { extendOwn as extend } from 'underscore';

import * as notebooksActions from './notebooksActions';
import * as settingsActions from './settingsActions';
import * as notesActions from './notesActions';

export {
  notebooksActions,
  settingsActions,
  notesActions
}

export default extend(
  notebooksActions,
  settingsActions,
  notesActions
);
