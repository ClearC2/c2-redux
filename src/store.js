import {Map} from 'immutable'
import {createStore, applyMiddleware, compose} from 'redux'
import thunk from 'redux-thunk'

export default function create (reducer, middleware = []) {
  return createStore(
    reducer,
    Map(),
    compose(
      applyMiddleware(thunk, ...middleware),
      window && window.devToolsExtension ? window.devToolsExtension() : f => f
    )
  )
}
