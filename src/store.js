import {Map} from 'immutable'
import {createStore, applyMiddleware, compose} from 'redux'
import thunk from 'redux-thunk'
import {combineReducers} from 'redux-immutable'

export default function create (reducerMap, middleware = []) {
  const reducer = combineReducers(reducerMap)
  return createStore(
    reducer,
    Map(),
    compose(
      applyMiddleware(thunk, ...middleware),
      window && window.devToolsExtension ? window.devToolsExtension() : f => f
    )
  )
}
