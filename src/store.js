import {createStore, applyMiddleware, combineReducers} from 'redux';

// App Reducers
import {reducer as player} from './api/player';
import {reducer as user} from './api/user';

import logger from 'redux-logger';

let dev = process.env.NODE_ENV === 'development';

// Middleware
let middleware = [];

if (dev)
  middleware.push(logger);

// Create Store
let store = createStore(
  combineReducers({player, user}), applyMiddleware(...middleware), window.devToolsExtension && dev
  ? window.devToolsExtension()
  : undefined);

export default store
