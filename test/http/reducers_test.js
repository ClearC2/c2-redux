import {fromJS} from 'immutable'
import {loadingReducer, messagesReducer, errorsReducer} from '../../src/http/reducer'
import {expect} from 'chai'

describe('http reducers', () => {
  const requestId = 'foo-123'
  describe('loading reducer', () => {
    const tests = [
      ['FETCH_STUFF_REQUEST', true],
      ['FETCH_STUFF_SUCCESS', false],
      ['FETCH_STUFF_FAILURE', false],
      ['FOOBAR', null]
    ]
    tests.forEach(test => (
      it(`handles ${test[0].substr(-7)}`, () => {
        const action = {type: test[0], requestId}
        const initialState = fromJS({[requestId]: null})
        const nextState = loadingReducer(initialState, action)
        expect(nextState).to.equal(fromJS({
          [requestId]: test[1]
        }))
      })
    ))
  })

  describe('messages reducer', () => {
    const existinMessage = 'existing message'
    const tests = [
      ['FETCH_STUFF_REQUEST', null],
      ['FETCH_STUFF_SUCCESS', 'new message'],
      ['FETCH_STUFF_FAILURE', null],
      ['FOOBAR', existinMessage]
    ]
    tests.forEach(test => (
      it(`handles ${test[0].substr(-7)}`, () => {
        const action = {type: test[0], requestId, response: {data: {message: 'new message'}}}
        const initialState = fromJS({[requestId]: existinMessage})
        const nextState = messagesReducer(initialState, action)
        expect(nextState).to.equal(fromJS({
          [requestId]: test[1]
        }))
      })
    ))
  })

  describe('errors reducer', () => {
    const existingErrors = [{detail: 'foobar'}]
    const newErrors = [{detail: 'new error'}]
    const tests = [
      ['FETCH_STUFF_REQUEST', null],
      ['FETCH_STUFF_SUCCESS', null],
      ['FETCH_STUFF_FAILURE', newErrors],
      ['FOOBAR', existingErrors]
    ]
    tests.forEach(test => (
      it(`handles ${test[0].substr(-7)}`, () => {
        const action = {type: test[0], requestId, error: {response: {data: {errors: newErrors}}}}
        const initialState = fromJS({[requestId]: existingErrors})
        const nextState = errorsReducer(initialState, action)
        expect(nextState).to.equal(fromJS({
          [requestId]: test[1]
        }))
      })
    ))
  })
})
