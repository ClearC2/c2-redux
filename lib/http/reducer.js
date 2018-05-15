'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.loadingReducer = loadingReducer;
exports.messagesReducer = messagesReducer;
exports.errorsReducer = errorsReducer;

var _immutable = require('immutable');

function loadingReducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (0, _immutable.Map)();
  var action = arguments[1];

  var matches = /(.*)_(REQUEST|SUCCESS|FAILURE)/.exec(action.type);
  if (!matches) return state;

  var _matches = _slicedToArray(matches, 3),
      requestState = _matches[2];

  return state.set(action.requestId, requestState === 'REQUEST');
}

function messagesReducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (0, _immutable.Map)();
  var action = arguments[1];

  var matches = /(.*)_(REQUEST|SUCCESS|FAILURE)/.exec(action.type);
  if (!matches) return state;

  var _matches2 = _slicedToArray(matches, 3),
      requestState = _matches2[2];

  var applies = requestState === 'SUCCESS';
  return state.set(action.requestId, applies ? (0, _immutable.fromJS)(action.response.data.message) : null);
}

function errorsReducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : (0, _immutable.Map)();
  var action = arguments[1];

  var matches = /(.*)_(REQUEST|SUCCESS|FAILURE)/.exec(action.type);
  if (!matches) return state;

  var _matches3 = _slicedToArray(matches, 3),
      requestState = _matches3[2];

  return state.set(action.requestId, requestState === 'FAILURE' ? (0, _immutable.fromJS)(action.error.response.data.errors) : null);
}