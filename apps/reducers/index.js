'use strict'
import TreeReducer from './treeReducer';
import ListReducer from './listReducer';

import { combineReducers } from 'redux'


const rootReducer = combineReducers({
  tree: TreeReducer,
  list: ListReducer
});

export default rootReducer