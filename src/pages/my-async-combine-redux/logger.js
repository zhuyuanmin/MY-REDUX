export default function logger({ getState, dispatch }) {
  return next => action => {
    console.log('=> prevState --------', getState())
    const returnVal = next(action)
    console.log('=> nextState --------', getState())
    return returnVal
  }
}
