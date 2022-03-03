// import { createStore, applyMiddleware, combineReducers } from 'redux'
import { createStore, applyMiddleware } from './createStore'
// import thunk from 'redux-thunk'
import thunk from './thunk'
// import logger from 'redux-logger'
import logger from './logger'


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
  counterReducer,
  applyMiddleware(thunk, logger)
)