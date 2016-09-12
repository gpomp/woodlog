'use strict'
import TreeReducer from './treeReducer';

import { combineReducers } from 'redux'


const rootReducer = combineReducers({
  tree: TreeReducer
});

export default rootReducer