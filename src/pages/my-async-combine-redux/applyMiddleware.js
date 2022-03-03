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
