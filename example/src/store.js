import {combineReducers} from 'redux-immutable'
import {
  createStore,
  apiMiddleware,
  loadingReducer,
  messagesReducer,
  errorsReducer
} from 'c2-redux'

const reducerMap = {
  http: combineReducers({
    loading: loadingReducer,
    messages: messagesReducer,
    errors: errorsReducer
  })
}

const defaultShouldCallAPI = (getState, requestId) => {
  const isLoading = getState().getIn(['http', 'loading', requestId]) || false
  return !isLoading
}

const appReducer = combineReducers(reducerMap)

const store = createStore(appReducer, [apiMiddleware(defaultShouldCallAPI)])

store.subscribe(() => {
  console.log(store.getState())
})

export default store
