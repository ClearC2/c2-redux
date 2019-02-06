'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = create;

var _immutable = require('immutable');

var _redux = require('redux');

var _reduxThunk = require('redux-thunk');

var _reduxThunk2 = _interopRequireDefault(_reduxThunk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function create(reducer) {
  var middleware = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

  return (0, _redux.createStore)(reducer, (0, _immutable.Map)(), (0, _redux.compose)(_redux.applyMiddleware.apply(undefined, [_reduxThunk2.default].concat(_toConsumableArray(middleware))), window && window.__REDUX_DEVTOOLS_EXTENSION__ ? window.__REDUX_DEVTOOLS_EXTENSION__() : function (f) {
    return f;
  }));
}