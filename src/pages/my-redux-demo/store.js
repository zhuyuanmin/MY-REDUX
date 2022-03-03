// import { createStore } from 'redux'
import createStore from './createStore'

export const counterReducer = (state = 0, { type, payload = 1 }) => {
  switch (type) {
    case "ADD":
      return state + payload;
    case "MINUS":
      return state - payload;
    default:
      return state;
  }
}

export default createStore(counterReducer)