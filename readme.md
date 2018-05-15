# C2 Redux [![CircleCI](https://circleci.com/gh/ClearC2/c2-redux.svg?style=svg)](https://circleci.com/gh/ClearC2/c2-redux)

`c2-redux` is a collection of utilities to implement and/or aid an existing redux store.

## Utilities

### createStore()
`c2-redux` comes with an easy way to create a redux store preconfigured with:
 - [redux-thunk](https://github.com/gaearon/redux-thunk)
 - [Immutable.js](https://facebook.github.io/immutable-js/)

If your project already has a redux store you can either replace it with `c2-redux`'s or skip this altogether.

```js
// src/redux/store.js
import {createStore} from 'c2-redux'
const reducerMap = {}
const middlware = []
export default createStore(reducerMap, middlware)
```

The `reducerMap` gets passed to redux's `combineReducers()` function.

### apiMiddleware
The `apiMiddleware` simplifies writing actions that interact with api endpoints. Make use of this middleware by adding it in the store creation.

```js
// src/redux/store.js
import {createStore, apiMiddleware} from 'c2-redux'
const reducerMap = {}
const defaultShouldCallAPI = (getState, requestId) => {
    const isLoading = getState().getIn(['http', 'loading', requestId]) || false
    return !isLoading
}
const middlware = [
    apiMiddleware(defaultShouldCallAPI)
]
export default createStore(reducerMap, middlware)
```
The one and only argument to `apiMiddleware` is the default function to use to determine whether to make a request. This can be overridden at the individual action level.

Once installed, your api interactions can be simplified as below.

```js
export const FETCH_TICKETS_REQUEST = 'FETCH_TICKETS_REQUEST'
export const FETCH_TICKETS_SUCCESS = 'FETCH_TICKETS_SUCCESS'
export const FETCH_TICKETS_FAILURE = 'FETCH_TICKETS_FAILURE'

export function fetchTickets (loginId) {
  return {
    types: [
      FETCH_TICKETS_REQUEST,
      FETCH_TICKETS_SUCCESS,
      FETCH_TICKETS_FAILURE
    ],
    requestId: fetchTickets.requestId(loginId),
    payload: {loginId},
    callAPI: () => axios.get(`/users/${loginId}/tickets`)
  }
}
fetchTickets.requestId = loginId => `fetch-tickets-${loginId}`
```

#### types
The `apiMiddleware` intercepts actions with a `types` field. It assumes the first type is the request type, the second type the success type, and the third type the failure type. It will always dispatch the request type before the request is made and dispatch either the success or failure type depending on the promise returned from `callAPI()`.

#### shouldCallAPI
If `undefined`, the default function provided to the middleware at instantiation will be used. Otherwise, this should be a function that returns a boolean. This function will receive redux's `getState` function as the first argument and the `requestId` as the second argument.

#### callAPI
This is a function that will receive redux's `getState` function as the one and only argument. This function should return a promise. If the promise successfully resolves, the resolved value will be the `response` on the success action. If the promise rejects, the rejected value will be the `error` on the failure action.

#### requestId
This should be a unique string identifying this particular request. It is convenient to define a `requestId()` function directly onto the action creator.

#### payload
The `payload` is any arbitrary data for logging or for the reducer(s). This object will be attached to all actions dispatched by the middleware.

In the previous example, the request action dispatched will look as follows:

```js
{
    type: 'FETCH_TICKETS_REQUEST',
    requestId: 'fetch-tickets-johndoe',
    payload: {
        loginId: 'johndoe'
    }
}
```

If the api request succeeds, a success action like the following will be dispatched.

```js
{
    type: 'FETCH_TICKETS_SUCCESS',
    requestId: 'fetch-tickets-johndoe',
    payload: {
        loginId: 'johndoe'
    },
    response: {
        data: {
            tickets: [{}, {}]
        },
        status: 200,
        // other axios response keys
    }
}
```

If the api request fails, a failure action like the following will be dispatched.
```js
{
    type: 'FETCH_TICKETS_FAILURE',
    requestId: 'fetch-tickets-johndoe',
    payload: {
        loginId: 'johndoe'
    },
    error: {
        response: {
            data: {
                errors: [{detail: 'User not found.'}]
            }
            status: 404
            // other axios error response keys
        }
        // other axios error keys
    }
}
```

### Reducers
`c2-redux` comes with a few default reducers for handling http request data. Choose which reducers will be suitable for your application.

#### loadingReducer
The loading reducer toggles the loading state of `requestId`'s.

#### messagesReducer
The messages reducer handles request messages. It assumes an axios response and stores the `message` key from the response. This default implementation might not suit your api backend.

#### errorsReducer
The errors reducer handles request errors. It assumes an axios error response with an `errors` key in the response. This default implementation might not suit your api backend.

If the above reducers will work for your application, make use of them like so.

```js
// src/redux/store.js
import {combineReducers} from 'redux'
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
const middlware = [
    apiMiddleware(defaultShouldCallAPI)
]
export default createStore(reducerMap, middlware)
```





