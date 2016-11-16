'use strict'
import TreeReducer from './treeReducer';
import ListReducer from './listReducer';
import NotesReducer from './NoteReducer';
import PhotoReducer from './photoReducer';

import { combineReducers } from 'redux'


const rootReducer = combineReducers({
  tree: TreeReducer,
  list: ListReducer,
  notes: NotesReducer,
  photos: PhotoReducer
});

export default rootReducer