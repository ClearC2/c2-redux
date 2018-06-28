const returnTrue = () => true

const apiMiddleware = (defaultShouldCallAPI = returnTrue) => ({dispatch, getState}) => next => action => {
  const {
    types,
    requestId,
    callAPI,
    shouldCallAPI = defaultShouldCallAPI,
    payload = {}
  } = action

  if (!types || !requestId) {
    // normal action: pass it on
    return next(action)
  }
  if (
    !Array.isArray(types) ||
    types.length !== 3 ||
    !types.every(type => typeof type === 'string')
  ) {
    throw new Error('Expected an array of three string types.')
  }

  if (typeof callAPI !== 'function') {
    throw new Error('Expected callAPI to be a function.')
  }

  if (typeof shouldCallAPI !== 'function') {
    throw new Error('Expected shouldCallAPI to be a function.')
  }

  if (!shouldCallAPI(getState, requestId)) {
    return
  }

  const [requestType, successType, failureType] = types
  dispatch({
    payload,
    type: requestType,
    requestId
  })
  return callAPI(getState).then(
    response => {
      dispatch({
        payload,
        response,
        type: successType,
        requestId
      })
      return response
    },
    error => {
      dispatch({
        payload,
        error,
        type: failureType,
        requestId
      })
      throw error
    }
  )
}

export default apiMiddleware
