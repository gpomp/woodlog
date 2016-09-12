'use strict'

import React from 'react';
import { applyMiddleware, createStore } from 'redux';
import { Provider } from 'react-redux';
import createLogger from 'redux-logger';
import promiseMiddleware from 'redux-promise-middleware';
import thunk from 'redux-thunk';
import rootReducer from './apps/reducers';
import App from './apps/app';

const logger = createLogger()
//const createStoreWithMiddleware = applyMiddleware(thunk, promiseMiddleware(), logger)(createStore)
//const store = createStoreWithMiddleware(rootReducer);
const store = createStore(rootReducer, {}, applyMiddleware(
  thunk,
  promiseMiddleware(),
  logger
));

const wrapper = () => {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  )
}

export default wrapper