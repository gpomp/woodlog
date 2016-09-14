import {
  SHOWLIST
} from '../actions/treeActions'

const initialState = {
  data: [],
  initialized: false,
  isPending: false
}

export default ListReducer = (state = initialState, action) => {
  switch (action.type) {
    case `${SHOWLIST}_PENDING`:
      return {
        state, isPending: true
      }
    break;
    case `${SHOWLIST}_FULFILLED`:
      return {
        ...state, data: action.payload.data, isPending: false, initialized: true
      }
    break;
    default:
      return state
  }
}

