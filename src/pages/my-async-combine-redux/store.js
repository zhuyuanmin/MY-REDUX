// import { createStore, applyMiddleware, combineReducers } from 'redux'
import { createStore, applyMiddleware, combineReducers } from './createStore'
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

export const counterReducer2 = (state = {num: 0}, { type, payload = 1 }) => {
  switch (type) {
    case "ADD2":
      return {...state, num: state.num + payload};
    default:
      return state;
  }
}

export default createStore(
  combineReducers({
    counter: counterReducer,
    counter2: counterReducer2,
  }),
  applyMiddleware(thunk, logger)
)