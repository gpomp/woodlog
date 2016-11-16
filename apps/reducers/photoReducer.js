import {
  SHOWPHOTO
} from '../actions/treeActions'

const photoInitialState = {
  list: []
}

export default PhotoReducer = (state = photoInitialState, action) => {
  switch (action.type) {
    case `${SHOWPHOTO}_PENDING`:
      return {
        ...state, isPending: true
      }
    break;
    case `${SHOWPHOTO}_FULFILLED`:
      return {
        ...state, list: action.payload.data, isPending: false, initialized: true
      }
    break;
    default:
      return state
  }
}

