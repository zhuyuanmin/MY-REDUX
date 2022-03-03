import { createStore, applyMiddleware, combineReducers } from 'redux'
import thunk from 'redux-thunk'
import logger from 'redux-logger'

export const counterReducer = (state = 0, { type, payload = 1 }) => {
  switch (type) {
    case "ADD":
      return state + payload;
    case "ASYNC-ADD":
      return state + payload;
    case "MINUS":
      return state - payload;
    default:
      return state;
  }
}

export default createStore(
  combineReducers({
    counter: counterReducer,
  }),
  applyMiddleware(thunk, logger)
)
