import {Map, fromJS} from 'immutable'

export function loadingReducer (state = Map(), action) {
  const matches = /(.*)_(REQUEST|SUCCESS|FAILURE)/.exec(action.type)
  if (!matches) return state
  const [,, requestState] = matches
  return state.set(action.requestId, requestState === 'REQUEST')
}

export function messagesReducer (state = Map(), action) {
  const matches = /(.*)_(REQUEST|SUCCESS|FAILURE)/.exec(action.type)
  if (!matches) return state
  const [,, requestState] = matches
  const applies = requestState === 'SUCCESS'
  return state.set(action.requestId, applies ? fromJS(action.response.data.message) : null)
}

export function errorsReducer (state = Map(), action) {
  const matches = /(.*)_(REQUEST|SUCCESS|FAILURE)/.exec(action.type)
  if (!matches) return state
  const [,, requestState] = matches
  return state.set(action.requestId, requestState === 'FAILURE' ? fromJS(action.error.response.data.errors) : null)
}
