import {
  CHANGETREE,
  SHOWTREE,
  // SAVENOTE,
  // REMOVENOTE,
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

      return {
        ...state, rawData: Object.assign({}, state.rawData, action.payload.rawData), isPending: false
      }
    break;
    case `${DELETEPHOTO}_FULFILLED`:
      
      return {
        ...state, rawData: action.payload.data, isPending: false
      }      
    break;
    default:
      return { ...state };
  }
}

