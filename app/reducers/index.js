import notebooksReducer from './notebooksReducer';
import settingsReducer from './settingsReducer';
import notesReducer from './notesReducer';

//import { innerReducer as initialStateReducer } from 'redux-async-initial-state';
import asyncInitialState from 'redux-async-initial-state'

const { innerReducer: initialStateReducer } = asyncInitialState

import { routerReducer } from 'react-router-redux';
import { reducer as uiReducer } from 'redux-ui';
import { combineReducers } from 'redux';

export default function createRootReducer(scope = 'main') {
  return scope === 'main'
  ? combineReducers({
      initialState: initialStateReducer,
      notebooks: notebooksReducer,
      settings: settingsReducer,
      notes: notesReducer,
    })
  : combineReducers({
    initialState: initialStateReducer,
    notebooks: notebooksReducer,
    settings: settingsReducer,
    routing: routerReducer,
    notes: notesReducer,
    ui: uiReducer
  });
}
