import {
  DEFAULT_ACTION,
  def_action
} from '../actions/exActions'

const initialState = {
  words: '',
  counter: 0
}

export default ExReducer = (state = initialState, action) => {
  switch (action.type) {
    case DEFAULT_ACTION:
      return {
        ...state, words: action.words, counter: state.counter + 1
      }
    break;
    default:
      return state
  }
}

