import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router, hashHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

import configureStore from 'store/configureStore';
import routes from 'config/routes';
import styles from 'styles/index';

const store = configureStore('renderer');
const history = syncHistoryWithStore(hashHistory, store);

render(
  <Provider store={ store }>
    <Router
      routes={ routes }
      history={ history }
      createElement={ (component, props) => {
        const { location, routes } = props;
        const isPageComponent = component === routes[routes.length - 1].component

        if (isPageComponent)
          props = { ...props, key: `${location.pathname}${location.search}` }

        return React.createElement(component, props);
      }}
    />
  </Provider>
, document.getElementById('root')
);
