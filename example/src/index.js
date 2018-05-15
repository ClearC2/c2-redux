import React from 'react'
import {render} from 'react-dom'
import {Provider} from 'react-redux'
import store from './store'

store.dispatch({
  types: [
    'FETCH_STUFF_REQUEST',
    'FETCH_STUFF_SUCCESS',
    'FETCH_STUFF_FAILURE'
  ],
  requestId: 'fetch-stuff-1',
  // fake an axios request
  callAPI: () => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          data: {
            message: 'success!',
            items: [1, 5, 4]
          }
        })
      }, 1500)
    })
  }
})

render(
  (
    <Provider store={store}>
      <div>
        Check the console
      </div>
    </Provider>
  ),
  document.getElementById('app')
)
