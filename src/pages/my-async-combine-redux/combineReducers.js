export default function combineReducers(reducers) {
  return (state = {}, action) => {
    const nextState = {}
    let hasChanged = false
    for (let key in reducers) {
      const reducer = reducers[key]
      nextState[key] = reducer(state[key], action)
      hasChanged = hasChanged || nextState[key] !== state[key]
    }

    return hasChanged ? nextState : state
  }
}
