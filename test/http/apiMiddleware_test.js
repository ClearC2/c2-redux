import apiMiddleware from '../../src/http/apiMiddleware'
import {Map} from 'immutable'
import sinon from 'sinon'
import {assert} from 'chai'

function assertActionsEqual (action, expected) {
  assert.equal(action.payload, expected.payload)
  assert.equal(action.type, expected.type)
  assert.equal(action.requestId, expected.requestId)
  assert.equal(action.response, expected.response)
  assert.equal(action.error, expected.error)
}

describe('api middleware', () => {
  const requestId = 'fetchThing'
  const response = {foo: 'bar'}
  const error = [{detail: 'Error'}]
  const payload = {id: 'abc'}
  const state = Map()
  let doDispatch = null
  let doGetState = null
  let nextHandler = null
  beforeEach(() => {
    doDispatch = sinon.fake()
    doGetState = sinon.fake.returns(state)
    nextHandler = apiMiddleware()({dispatch: doDispatch, getState: doGetState})
  })
  it('must return a function to handle next', () => {
    assert.isFunction(nextHandler)
    assert.strictEqual(nextHandler.length, 1)
  })
  it('must pass action to next if no types', done => {
    const actionObj = {}
    const actionHandler = nextHandler(action => {
      assert.strictEqual(action, actionObj)
      done()
    })
    actionHandler(actionObj)
  })
  it('must throw error if less than 3 types', done => {
    const actionObj = {types: ['1', '2'], requestId}
    const actionHandler = nextHandler(() => {})
    assert.throws(() => actionHandler(actionObj))
    done()
  })
  it('must throw error if callAPI is not function', done => {
    const actionObj = {types: ['1', '2', '3'], requestId, callAPI: 'not func'}
    const actionHandler = nextHandler(() => {})
    assert.throws(() => actionHandler(actionObj))
    done()
  })
  it('must throw error if shouldCallAPI is not function', done => {
    const actionObj = {types: ['1', '2', '3'], requestId, callAPI: () => {}, shouldCallAPI: 'not func'}
    const actionHandler = nextHandler(() => {})
    assert.throws(() => actionHandler(actionObj))
    done()
  })
  it('must not use callAPI if shouldCallAPI returns false', done => {
    const callAPI = sinon.fake()
    const actionObj = {types: ['1', '2', '3'], requestId, callAPI, shouldCallAPI: () => false}
    const actionHandler = nextHandler(() => {})
    actionHandler(actionObj)
    assert.equal(callAPI.callCount, 0)
    done()
  })
  it('must use callAPI if shouldCallAPI returns true', done => {
    const callAPI = sinon.fake.resolves({})
    const actionObj = {types: ['1', '2', '3'], requestId, callAPI, shouldCallAPI: () => true}
    const actionHandler = nextHandler(() => {})
    actionHandler(actionObj)
    assert.equal(callAPI.callCount, 1)
    done()
  })
  it('must use callAPI with state if shouldCallAPI returns true', done => {
    const callAPI = sinon.fake.resolves({})
    const actionObj = {types: ['1', '2', '3'], requestId, callAPI, shouldCallAPI: () => true}
    const actionHandler = nextHandler(() => {})
    actionHandler(actionObj)
    assert.equal(callAPI.lastArg, doGetState)
    done()
  })
  it('must dispatch request, success types on resolve', done => {
    const callAPI = sinon.fake.resolves(response)
    const types = ['request', 'success', 'failure']
    const actionObj = {types, requestId, callAPI, shouldCallAPI: () => true, payload}
    const actionHandler = nextHandler(() => {})
    actionHandler(actionObj).then(() => {
      assert.equal(doDispatch.callCount, 2)
      assertActionsEqual(
        doDispatch.getCall(0).lastArg,
        {type: types[0], requestId, payload}
      )
      assertActionsEqual(
        doDispatch.getCall(1).lastArg,
        {type: types[1], requestId, response, payload}
      )
      done()
    })
  })
  it('must dispatch request, failure types on reject', done => {
    const callAPI = sinon.fake.returns(Promise.reject(error))
    const types = ['request', 'success', 'failure']
    const actionObj = {types, requestId, callAPI, shouldCallAPI: () => true, payload}
    const actionHandler = nextHandler(() => {})
    actionHandler(actionObj).then(() => {
      assert.equal(doDispatch.callCount, 2)
      assertActionsEqual(
        doDispatch.getCall(0).lastArg,
        {type: types[0], requestId, payload}
      )
      assertActionsEqual(
        doDispatch.getCall(1).lastArg,
        {type: types[2], requestId, error, payload}
      )
      done()
    })
  })
})
