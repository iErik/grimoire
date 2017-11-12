import { createStore, applyMiddleware, compose } from 'redux';
import { hashHistory } from 'react-router';

import {
  outerReducer as hydrateReducers,
  middleware as hydrateMiddleware
} from 'redux-async-initial-state';

import { electronEnhancer } from 'redux-electron-store';

import { routerMiddleware } from 'react-router-redux';
import createSagaMiddleware from 'redux-saga';
import createLogger from 'redux-logger';

import createRootReducer from '../reducers';
import rootSaga from '../sagas';

import settings from 'electron-settings';
import Notebooks from '../database/collections/notebooks';
import Notes from '../database/collections/notes';

const logger = createLogger({ level: 'info', collapsed: true });
const router = routerMiddleware(hashHistory);
const sagas  = createSagaMiddleware();

const defaultFilter = {
  initialState: true,
  notebooks: true,
  settings: true,
  routing: true,
  notes: true,
  ui: true
}

const loadState = async (currentState) => {
  let activeNotebook = await Notebooks.findOneAsync({}) || { };

  return {
    ...currentState,

    notes: {
      notes: await Notes.findAsync({}),
      selectedNote: await Notes.findOneAsync({ notebookId: activeNotebook._id }) || { }
    },

    notebooks: {
      notebooks: await Notebooks.findAsync({}),
      activeNotebook
    },

    settings: await settings.get()
  };
};

export default function configureStore(scope = 'main', filter = defaultFilter) {
  const composeEnhancers = scope === 'renderer'
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
    : compose;

  const reducer = scope === 'main'
    ? hydrateReducers(createRootReducer(scope))
    : createRootReducer(scope);

  const middleware = scope === 'main'
    ? [sagas, hydrateMiddleware(loadState)]
    : [router, logger, sagas];

  const enhancer = scope === 'main'
    ? composeEnhancers(
        applyMiddleware(...middleware),
        electronEnhancer({ dispatchProxy: a => store.dispatch(a) })
      )
    : composeEnhancers(
        applyMiddleware(...middleware),
        electronEnhancer({ filter, dispatchProxy: a => store.dispatch(a) })
      );

  const store = createStore(reducer, enhancer);

  if (scope === 'main')
    sagas.run(rootSaga);

  if (scope === 'renderer' && module.hot) {
    module.hot.accept('../reducers', () =>
      store.replaceReducer(require('../reducers'))
    );
  }

  return store;
}
