import React, { Component } from 'react'
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

  asyncAdd = () => {
    // setTimeout(() => {
    //   store.dispatch({ type: 'ASYNC-ADD', payload: 50 })
    // }, 1000)
    store.dispatch((dispatch, getState) => {
      setTimeout(() => {
        dispatch({ type: 'ASYNC-ADD', payload: 50 })
      }, 1000)
    })
  }

  add2 = () => {
    store.dispatch({ type: 'ADD2', payload: 30 })
  }

  minus = () => {
    store.dispatch({ type: 'MINUS' })
  }

  render() {
    return (
      <div>
        <h3>ReduxPage</h3>
        <div>{store.getState().counter}</div>
        <button onClick={this.add}>add</button>
        <button onClick={this.asyncAdd}>asyncAdd</button>
        <button onClick={this.minus}>minus</button>

        <p>
          <button onClick={this.add2}>
            Reducer 2:
          </button>
          {store.getState().counter2.num}
        </p>
      </div>
    )
  }
}
