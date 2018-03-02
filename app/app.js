import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route } from 'react-router-dom';

import { ConnectedRouter } from 'react-router-redux';
import configureStore from 'store/configureStore';
import hashHistory from 'store/hashHistory';
import styles from 'styles/index';

import RootLayout from 'containers/layouts/RootLayout';

const store = configureStore('renderer');

render(
  <Provider store={ store }>
    <ConnectedRouter history={ hashHistory }>
      <Route path="/" component={ RootLayout } />
    </ConnectedRouter>
  </Provider>
, document.getElementById('root')
);
