import {
  CHANGETREE,
  SHOWTREE,
  SAVENOTE
} from '../actions/treeActions'

const initialState = {
  key: 'tree',  
  id: -1,
  rawData: {
    name: '', species: '', age: '', potType: '', style: '', height: '', trunkWidth: '', canopyWidth: '', Source: '', date: '', notes:[]

  },
  expires: null,
  isPending: false,
  initialized: false
}

export default TreeReducer = (state = initialState, action) => {
  switch (action.type) {
    case `${CHANGETREE}_PENDING`:
    case `${SHOWTREE}_PENDING`:
      return {
        ...state, isPending: true
      }
    break;
    case `${CHANGETREE}_FULFILLED`:
    console.log('tree data to save')
      return {
        ...state, id: action.payload.id, rawData: Object.assign({}, state.rawData, action.payload.rawData), isPending: false
      }
    break;
    case `${SHOWTREE}_FULFILLED`:
      return {
        ...state, id: action.payload.id, rawData: Object.assign({}, state.rawData, action.payload.rawData), isPending: false, initialized: true
      }
    break;
    case SAVENOTE:


      const {text, date} = action.payload.note;
      const stateCopy = Object.assign({}, state);
      const noteCopy = stateCopy.rawData.notes;
      if(action.payload.id === -1) noteCopy.push({text, date});
      else noteCopy[action.payload.id] = action.payload.note;

      global.storage.save(stateCopy);

      return {
        ...state, rawData: Object.assign({}, state.rawData, { notes: noteCopy })
      }
    break;
    default:
      return state
  }
}

