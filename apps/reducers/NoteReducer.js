import {
  SHOWNOTES,
  SAVENOTE,
  REMOVENOTE,
} from '../actions/treeActions'

const noteInitialState = {
  note: '',
  date: null,
  photoList: []
}

const note = (state = noteInitialState, type) => {
  switch (type) {
    case `${SHOWNOTES}_FULFILLED`:
      const { id, note, date, photoList } = state;
      return {
        id, note, date, photoList
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
  switch (action.type) {
    case `${SHOWNOTES}_PENDING`:
    case `${SAVENOTE}_PENDING`:
    case `${REMOVENOTE}_PENDING`:
      return { ...state, isPending: true };
    break;
    case `${SHOWNOTES}_FULFILLED`:
      list = action.payload.notes.map((noteEntry, i) => {
        const nEntry = Object.assign({}, noteEntry);
        nEntry.id = action.payload.ids[i];
        return note(nEntry, action.type);
      });
      return {list, isPending: false};
    break;
    case `${SAVENOTE}_FULFILLED`:
      list = state.list.slice();

      if(action.payload.id !== -1) {
        list[action.payload.id] = action.payload.data;
      } else {
        list.push(action.payload.data);
      }
      return {list, isPending: false};
    break;
    case `${REMOVENOTE}_FULFILLED`:
      list = state.list.slice();
      list.splice(action.payload.id, 1);
      return {list, isPending: false};
    break;
    default:
      return { ...state, isPending: true };
  }
}