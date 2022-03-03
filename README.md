# My-Redux 原理实现

## 〇、聚合函数体验

* 思考: 如何顺序执行：f1, f2, f3 ?

  ```javascript
  // demo_reduce.js
  function f1(arg) {
    console.log('f1', arg);
    return arg;
  }
  
  function f2(arg) {
    console.log('f2', arg);
    return arg;
  }
  
  function f3(arg) {
    console.log('f3', arg);
    return arg;
  }
  ```

* 方法一：函数嵌套写法

  ```javascript
  f3(f2(f1('omg')))
  ```

* 方法二：聚合写法

  ```javascript
  function compose(...funcs) {
    if (funcs.length === 0) {
      return arg => arg
    }
  
    if (funcs.length === 1) {
      return funcs[0]
    }
  
    // fn 聚合后的函数   fn2 当前函数
    return funcs.reduce((fn, fn2) => (...args) => fn2(fn(...args)))
  }
  
  const res = compose(f1, f2, f3)('omg')
  console.log(res);
  ```

  

## 一、 Redux 使用

* Redux 工作流

  ![](https://www.ruanyifeng.com/blogimg/asset/2016/bg2016091802.jpg)

* 安装

  `npm i redux` 或者 `yarn add redux`

* 使用：

  ```javascript
  // store.js
  import { createStore } from 'redux'
  
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
  ```

  ```jsx
  import { Component } from 'react'
  import store from './store'
  
  export default class ReduxPage extends Component {
    componentDidMount() {
      this.unsubscribe = store.subscribe(() => {
        this.forceUpdate();
      })
    }
  
    // 取消订阅
    componentWillUnmount() {
      if (this.unsubscribe) {
        this.unsubscribe()
      }
    }
  
    // 派发事件
    add = () => {
      store.dispatch({ type: 'ADD', payload: 100 })
    }
  
    minus = () => {
      store.dispatch({ type: 'MINUS' })
    }
  
    render() {
      return (
        <div>
          <h3>ReduxPage</h3>
          <div>{store.getState()}</div>
          <button onClick={this.add}>add</button>
          <button onClick={this.minus}>minus</button>
        </div>
      )
    }
  }
  ```

  

* `redux` api 解释
  * `createStore` 创建 `store` ，接收 `reducer`，返回一个对象
  
  * `reducer` 初始化、修改状态函数，纯函数
  
  * `getState` 获取状态值
  
  * `dispatch` 提交更新，接收 `action` `payload`
  
  * `subscribe` 变更订阅
  
    

## 二、My-Redux 基本功能实现

* 定义 `createStore` 函数，实现`getState` `dispatch` `subscribe` 这三个 Api：

  ```javascript
  // createStore.js
  export default function createStore(reducer) {
    let currentState; // 定义当前 state
    let currentListeners = []; // 定义监听函数
  
    // getState api
    function getState() {
      return currentState;
    }
    
    // dispatch api
    function dispatch(action) {
      currentState = reducer(currentState, action);
  
      currentListeners.forEach(listener => listener());
    }
  
    // subscribe api
    function subscribe(listener) {
      currentListeners.push(listener);
    }
  
    return {
      getState,
      dispatch,
      subscribe
    }
  }
  ```

* 获取初始值

  ```javascript
  // createStore.js
  export default function createStore(reducer) {
    ...
    // 触发获取初始值
    dispatch({ type: '@my-redux-xxxx' })
    
    return { ... }
  }
  ```

  

* 取消订阅

  ```javascript
  // createStore.js
  export default function createStore(reducer) {
    ...
    // subscribe api
    function subscribe(listener) {
      currentListeners.push(listener);
  
      return () => {
        const index = currentListeners.indexOf(listener);
        currentListeners.splice(index, 1);
      }
    }
    
    return {...}
  }
  ```



## 三、异步实现

* 中间件原理示意图

  ![](https://www.ruanyifeng.com/blogimg/asset/2016/bg2016092002.jpg)

* 使用：

  ```javascript
  // store.js
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
  
  
  // pageJsx
  asyncAdd = () => {
    store.dispatch((dispatch, getState) => {
      setTimeout(() => {
        dispatch({ type: 'ASYNC-ADD', payload: 50 })
      }, 1000)
    })
  }
  ```

  

* 实现：

  ```javascript
  // store.js
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
  ```

  ```javascript
  // createStore.js
  import applyMiddleware from './applyMiddleware'
  
  function createStore(reducer, enhancer) {
    // enhancer 加强 dispatch
    if (enhancer) {
      return enhancer(createStore)(reducer)
    }
    
    ...
  }
  ```

  ```javascript
  // applyMiddleware.js
  function compose(...funcs) {
    if (funcs.length === 0) {
      return arg => arg
    }
  
    if (funcs.length === 1) {
      return funcs[0]
    }
  
    // fn 聚合后的函数   fn2 当前函数
    return funcs.reduce((fn, fn2) => {
      return (...args) => fn(fn2(...args))
    })
  }
  
  export default function applyMiddleware(...middlewares) {
    // console.log(middlewares);
  
    return createStore => reducer => {
      // todo 加强 dispatch
      const store = createStore(reducer);
      let dispatch = store.dispatch
  
      const middlewareChain = middlewares.map(middleware => middleware({
        getState: store.getState,
        dispatch: (action, ...args) => dispatch(action, ...args)
      }))
  
      // 按照顺序执行中间件函数
      // 加强版的 dispatch
      dispatch = compose(...middlewareChain)(store.dispatch)
  
      return {
        ...store,
        dispatch
      }
    }
  }
  ```

  ```javascript
  // thunk.js
  export default function thunk({ getState, dispatch }) {
    return next => action => {
      if (typeof action === 'function') {
        return action(dispatch, getState)
      }
      return next(action)
    }
  }
  ```

  ```javascript
  // logger.js
  export default function logger({ getState, dispatch }) {
    return next => action => {
      console.log('=> prevState --------', getState())
      const returnVal = next(action)
      console.log('=> nextState --------', getState())
      return returnVal
    }
  }
  ```

  

## 四、CombineReducer 实现

* 实现：

  ```javascript
  // store.js
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
  ```

  ```javascript
  // combineReducers.js
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
  ```

  

