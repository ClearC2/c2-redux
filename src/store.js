import {Map} from 'immutable'
import {createStore, applyMiddleware, compose} from 'redux'
import thunk from 'redux-thunk'

export default function create (reducer, middleware = []) {
  return createStore(
    reducer,
    Map(),
    compose(
      applyMiddleware(thunk, ...middleware),
      window && window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : f => f
    )
  )
}
