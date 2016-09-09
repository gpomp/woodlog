'use strict'
import ExReducer from './exReducer';

import { combineReducers } from 'redux'


const rootReducer = combineReducers({
  ex: ExReducer
});

export default rootReducer