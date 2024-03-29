import {
  SHOWNOTES,
  SAVENOTE,
  REMOVENOTE,
} from '../actions/treeActions'

import {findIDInList} from '../utils/utils';

const noteInitialState = {
  note: '',
  date: new Date(),
  eventID: '-1'
}

const note = (state = noteInitialState, type) => {
  switch (type) {
    case `${SHOWNOTES}_FULFILLED`:
      const { id, note, date, eventID } = state;
      return {
        id, note, date, eventID
      }
    break;
    default:
      return state
  }
}

const notesInitialState = {
  list: [],
  isPending: true
}

export default NotesReducer = (state = notesInitialState, action) => {
  let list;
  let noteI;
  switch (action.type) {
    case `${SHOWNOTES}_PENDING`:
    case `${SAVENOTE}_PENDING`:
    case `${REMOVENOTE}_PENDING`:
      return { ...state, isPending: true };
    break;
    case `${SHOWNOTES}_FULFILLED`:
      list = action.payload.notes.map((noteEntry, i) => {
        const nEntry = Object.assign({
          note: '',
          date: null,
          eventID: '-1'
        }, noteEntry);
        nEntry.id = action.payload.ids[i];
        return note(nEntry, action.type);
      });
      return {list, isPending: false};
    break;
    case `${SAVENOTE}_FULFILLED`:
      list = state.list.slice();
      noteI = findIDInList(list, action.payload.data.id);
      if(noteI !== -1) {
        list[noteI] = action.payload.data;
      } else {
        list.push(action.payload.data);
      }
      return {list, isPending: false};
    break;
    case `${REMOVENOTE}_FULFILLED`:
      list = state.list.slice();
      noteI = findIDInList(list, action.payload.id);
      list.splice(noteI, 1);
      return {list, isPending: false};
    break;
    default:
      return { ...state, isPending: true };
  }
}