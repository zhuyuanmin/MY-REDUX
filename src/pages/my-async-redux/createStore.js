import applyMiddleware from './applyMiddleware'

function createStore(reducer, enhancer) {
  // enhancer 加强 dispatch

  if (enhancer) {
    return enhancer(createStore)(reducer)
  }

  let currentState;
  let currentListeners = [];

  function getState() {
    return currentState;
  }
  
  function dispatch(action) {
    currentState = reducer(currentState, action);

    currentListeners.forEach(listener => listener());
  }

  function subscribe(listener) {
    currentListeners.push(listener);

    return () => {
      const index = currentListeners.indexOf(listener);
      currentListeners.splice(index, 1);
    }
  }

  // 触发获取初始值
  dispatch({ type: '@my-redux-xxxx' })

  return {
    getState,
    dispatch,
    subscribe
  }
}

export {
  createStore,
  applyMiddleware
}
