import {
  CHANGETREE
} from '../actions/treeActions'

const initialState = {
  key: 'tree',  
  id: -1,
  rawData: {},
  expires: null,
  isPending: false
}

export default TreeReducer = (state = initialState, action) => {
  switch (action.type) {
    case `${CHANGETREE}_PENDING`:
      return {
        state, isPending: true
      }
    break;
    case `${CHANGETREE}_FULFILLED`:
      return {
        ...state, id: action.payload.id, rawData: action.payload.rawData, isPending: false
      }
    break;
    default:
      return state
  }
}

