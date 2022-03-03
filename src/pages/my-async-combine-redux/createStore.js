import applyMiddleware from './applyMiddleware'
import combineReducers from './combineReducers'

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

// 这里需要注意，加了 default 导出将无法解构使用 
export {
  createStore,
  applyMiddleware,
  combineReducers
}
