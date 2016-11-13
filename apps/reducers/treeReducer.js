import {
  CHANGETREE,
  SHOWTREE,
  SAVENOTE,
  REMOVENOTE,
  RESET,
  SAVENEWPHOTO,
  DELETEPHOTO
} from '../actions/treeActions'

const initialState = {
  key: 'tree',  
  id: -1,
  rawData: {
    name: '', 
    type: '',
    species: '',
    age: null, 
    potType: '', 
    style: '', 
    potSize: {
      width: null,
      height: null,
      depth: null
    },
    height: null, 
    trunkWidth: null, 
    canopyWidth: null, 
    Source: '', 
    date: new Date(), 
    notes:[],
    photos: []
  },
  expires: null,
  isPending: false,
  initialized: false
}

export default TreeReducer = (state = initialState, action) => {
  let stateCopy;
  switch (action.type) {
    case `${CHANGETREE}_PENDING`:
    case `${SHOWTREE}_PENDING`:
    case `${SAVENEWPHOTO}_PENDING`:
    case `${DELETEPHOTO}_PENDING`:
      return {
        ...state, isPending: true
      }
    break;
    case `${CHANGETREE}_FULFILLED`:
      return {
        ...state, id: action.payload.id, rawData: Object.assign({}, state.rawData, action.payload.rawData), isPending: false
      }
    break;
    case `${SHOWTREE}_FULFILLED`:
      return {
        ...state, id: action.payload.id, rawData: Object.assign({}, state.rawData, action.payload.rawData), isPending: false, initialized: true
      }
    break;
    case RESET:
      return {
        ...state, id: -1, rawData: Object.assign({}, state.rawData, initialState.rawData), isPending: false, initialized: false
      }
    break;
    case `${SAVENEWPHOTO}_FULFILLED`:
      stateCopy = Object.assign({}, state);
      stateCopy.rawData.photos.push(action.payload.id);
      global.storage.save(stateCopy);

      return {
        ...state, rawData: Object.assign({}, state.rawData, stateCopy.rawData), isPending: false
      }
    break;
    case `${DELETEPHOTO}_FULFILLED`:
      stateCopy = Object.assign({}, state);
      let arrayID = -1;
      for (var i = 0; i < stateCopy.rawData.photos.length; i++) {
        if(stateCopy.rawData.photos[i] === action.payload.id) {
          arrayID = i;
          break;
        }
      }
      if(arrayID >= 0) {
        stateCopy.rawData.photos.splice(arrayID, 1);
      }
      global.storage.save(stateCopy);

      return {
        ...state, rawData: stateCopy.rawData, isPending: false
      }      
    break;
    case REMOVENOTE:
      stateCopy = Object.assign({}, state);

      stateCopy.rawData.notes.splice(action.payload.id, 1);
      global.storage.save(stateCopy);

      return {
        ...state, rawData: stateCopy.rawData
      }      
    break;
    case SAVENOTE:
      const {note, date} = action.payload.note;
      stateCopy = Object.assign({}, state);
      const noteCopy = stateCopy.rawData.notes;
      if(isNaN(action.payload.id) || action.payload.id < 0) {
        noteCopy.push({note, date});
      }
      else noteCopy[action.payload.id] = action.payload.note;
      global.storage.save(stateCopy);

      return {
        ...state, rawData: stateCopy.rawData
      }
    break;
    default:
      return state
  }
}

